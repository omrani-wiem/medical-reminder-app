// hooks/useMesMedicaments.js
import { useState, useEffect, useMemo } from 'react';
import {
  getMedicaments,
  ajouterMedicament,
  modifierMedicament,
  supprimerMedicament
} from '../services/medicamentService';
import { FORM_INITIAL, filtrerMedicaments } from '../utils/medicamentUtils';

const preparerDonnees = (formData, user) => ({
  nom: formData.nom,
  dose: formData.dosage,
  forme: formData.forme,
  couleur: formData.couleur,
  frequence: formData.frequence,
  heure: formData.prochainePrise || '08:00',
  duree: formData.duree,
  stock: parseInt(formData.stock) || 0,
  stockMin: parseInt(formData.stockMin) || 0,
  medecin: formData.medecin,
  dateDebut: formData.dateDebut,
  dateFin: formData.dateFin,
  instructions: formData.instructions,
  email: user.email,
  userId: user.id
});

export const useMesMedicaments = () => {
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('tous');
  const [formData, setFormData] = useState(FORM_INITIAL);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.email) { setError('Utilisateur non connecté'); return; }
      const data = await getMedicaments(user.email);
      setMedicaments(data);
      setError('');
    } catch (err) {
      setError('Impossible de charger les médicaments');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(FORM_INITIAL);
    setShowAddForm(false);
    setEditingMed(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const donnees = preparerDonnees(formData, user);

      if (editingMed) {
        await modifierMedicament(editingMed._id || editingMed.id, donnees);
      } else {
        await ajouterMedicament(donnees);
      }

      await fetchData();
      resetForm();
    } catch (err) {
      setError('Erreur lors de l\'enregistrement du médicament');
    }
  };

  const handleEdit = (medicament) => {
    setFormData({ ...FORM_INITIAL, ...medicament });
    setEditingMed(medicament);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) return;
    try {
      await supprimerMedicament(id);
      await fetchData();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const ouvrirFormulaire = () => {
    setFormData(FORM_INITIAL);
    setEditingMed(null);
    setShowAddForm(true);
  };

  const medicamentsFiltres = useMemo(
    () => filtrerMedicaments(medicaments, searchTerm, filterType),
    [medicaments, searchTerm, filterType]
  );

  return {
    medicaments, medicamentsFiltres,
    loading, error,
    showAddForm, editingMed, formData,
    searchTerm, setSearchTerm,
    filterType, setFilterType,
    handleInputChange, handleSubmit,
    handleEdit, handleDelete,
    ouvrirFormulaire, resetForm
  };
};