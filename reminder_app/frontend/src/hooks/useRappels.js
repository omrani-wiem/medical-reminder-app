// hooks/useRappels.js
import { useState, useEffect, useMemo } from 'react';
import {
  getRappels, ajouterRappel,
  modifierRappel, supprimerRappel
} from '../services/rappelService';
import {
  FORM_INITIAL, calculateNextReminder,
  calculerStatsRappels, validerFormRappel
} from '../utils/rappelUtils';

export const useRappels = () => {
  const [rappels, setRappels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRappel, setEditingRappel] = useState(null);
  const [formData, setFormData] = useState(FORM_INITIAL);

  const getUser = () => JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = getUser();
        if (!user?.email) { setError('Utilisateur non connecté'); return; }

        // ✅ vraies données depuis le backend
        const data = await getRappels(user.email);
        setRappels(data.map(r => ({
          ...r,
          id: r._id,
          prochainRappel: calculateNextReminder(r.jours, r.heures)
        })));
      } catch (err) {
        setError('Erreur lors du chargement des rappels');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData(FORM_INITIAL);
    setEditingRappel(null);
    setShowModal(false);
  };

  const handleAdd = () => {
    setEditingRappel(null);
    setFormData(FORM_INITIAL);
    setShowModal(true);
  };

  const handleEdit = (rappel) => {
    setEditingRappel(rappel);
    setFormData({
      medicament: rappel.medicament,
      heures: [...rappel.heures],
      jours: [...rappel.jours],
      son: rappel.son,
      vibration: rappel.vibration,
      actif: rappel.actif
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const erreur = validerFormRappel(formData);
    if (erreur) { setError(erreur); return; }

    try {
      const user = getUser();
      const rappelData = {
        ...formData,
        email: user.email,
        userId: user.id,
        heures: formData.heures.filter(h => h.trim())
      };

      if (editingRappel) {
        // ✅ PUT vers le backend
        const updated = await modifierRappel(editingRappel.id, rappelData);
        setRappels(prev =>
          prev.map(r => r.id === editingRappel.id
            ? { ...updated, id: updated._id, prochainRappel: calculateNextReminder(updated.jours, updated.heures) }
            : r
          )
        );
      } else {
        // ✅ POST vers le backend
        const created = await ajouterRappel(rappelData);
        setRappels(prev => [...prev, {
          ...created,
          id: created._id,
          prochainRappel: calculateNextReminder(created.jours, created.heures)
        }]);
      }
      resetForm();
    } catch (err) {
      setError('Erreur lors de la sauvegarde du rappel');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rappel ?')) return;
    try {
      // ✅ DELETE vers le backend
      await supprimerRappel(id);
      setRappels(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const toggleActive = async (id) => {
    const rappel = rappels.find(r => r.id === id);
    if (!rappel) return;
    try {
      // ✅ PUT vers le backend
      await modifierRappel(id, { ...rappel, actif: !rappel.actif });
      setRappels(prev =>
        prev.map(r => r.id === id ? { ...r, actif: !r.actif } : r)
      );
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const addHeure    = () => setFormData(p => ({ ...p, heures: [...p.heures, ''] }));
  const removeHeure = (i) => setFormData(p => ({ ...p, heures: p.heures.filter((_, idx) => idx !== i) }));
  const updateHeure = (i, v) => setFormData(p => { const h = [...p.heures]; h[i] = v; return { ...p, heures: h }; });
  const toggleJour  = (j) => setFormData(p => ({
    ...p,
    jours: p.jours.includes(j) ? p.jours.filter(x => x !== j) : [...p.jours, j]
  }));
  const updateFormField = (name, value) => setFormData(p => ({ ...p, [name]: value }));

  const stats = useMemo(() => calculerStatsRappels(rappels), [rappels]);

  return {
    rappels, loading, error, stats,
    showModal, editingRappel, formData,
    handleAdd, handleEdit, handleSave,
    handleDelete, toggleActive, resetForm,
    addHeure, removeHeure, updateHeure,
    toggleJour, updateFormField
  };
};