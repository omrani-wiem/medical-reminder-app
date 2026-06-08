
import { useState, useEffect, useMemo } from 'react';
import { getMedicaments } from '../services/medicamentService';
import {
  FORM_INITIAL,
  calculateNextReminder,
  transformMedicamentsToRappels,
  calculerStatsRappels,
  validerFormRappel
} from '../utils/rappelUtils';

export const useRappels = () => {
  const [rappels, setRappels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRappel, setEditingRappel] = useState(null);
  const [formData, setFormData] = useState(FORM_INITIAL);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.email) { setError('Utilisateur non connecté'); return; }

        const medicaments = await getMedicaments(user.email);
        setRappels(transformMedicamentsToRappels(medicaments));
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

  const handleSave = () => {
    const erreur = validerFormRappel(formData);
    if (erreur) { setError(erreur); return; }

    const rappelData = {
      ...formData,
      id: editingRappel ? editingRappel.id : Date.now(),
      heures: formData.heures.filter(h => h.trim()),
      prochainRappel: calculateNextReminder(formData.jours, formData.heures)
    };

    setRappels(prev =>
      editingRappel
        ? prev.map(r => r.id === editingRappel.id ? rappelData : r)
        : [...prev, rappelData]
    );
    resetForm();
  };

  const handleDelete = (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rappel ?')) return;
    setRappels(prev => prev.filter(r => r.id !== id));
  };

  const toggleActive = (id) => {
    setRappels(prev =>
      prev.map(r => r.id === id ? { ...r, actif: !r.actif } : r)
    );
  };

  // Gestion des heures
  const addHeure = () =>
    setFormData(prev => ({ ...prev, heures: [...prev.heures, ''] }));

  const removeHeure = (index) =>
    setFormData(prev => ({
      ...prev,
      heures: prev.heures.filter((_, i) => i !== index)
    }));

  const updateHeure = (index, value) =>
    setFormData(prev => {
      const heures = [...prev.heures];
      heures[index] = value;
      return { ...prev, heures };
    });

  const toggleJour = (jour) =>
    setFormData(prev => ({
      ...prev,
      jours: prev.jours.includes(jour)
        ? prev.jours.filter(j => j !== jour)
        : [...prev.jours, jour]
    }));

  const updateFormField = (name, value) =>
    setFormData(prev => ({ ...prev, [name]: value }));

  const stats = useMemo(() => calculerStatsRappels(rappels), [rappels]);

  return {
    rappels, loading, error, stats,
    showModal, editingRappel, formData,
    handleAdd, handleEdit, handleSave, handleDelete,
    toggleActive, resetForm,
    addHeure, removeHeure, updateHeure,
    toggleJour, updateFormField
  };
};