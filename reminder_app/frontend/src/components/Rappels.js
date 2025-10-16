import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Rappels.css';

const Rappels = () => {
  const { t } = useTranslation();
  const [rappels, setRappels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer les rappels depuis le backend
  useEffect(() => {
    fetchRappels();
  }, []);

  const fetchRappels = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`http://localhost:5000/medicaments?email=${user.email}`);
      
      if (response.ok) {
        const medicaments = await response.json();
        // Transformer les médicaments en rappels
        const rappelsFromMeds = medicaments.map(med => ({
          id: med.id || Date.now() + Math.random(),
          medicament: `${med.nom} ${med.dosage || ''}`,
          heures: med.heures_prise || ['08:00'],
          actif: true,
          jours: med.frequence === 'quotidien' ? ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'] : 
                 med.frequence === 'hebdomadaire' ? ['lun'] : ['lun', 'mar', 'mer', 'jeu', 'ven'],
          son: true,
          vibration: true,
          prochainRappel: calculateNextReminder(['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'], med.heures_prise || ['08:00'])
        }));
        setRappels(rappelsFromMeds);
      } else {
        console.error('Erreur lors de la récupération des rappels');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculer le prochain rappel
  const calculateNextReminder = (jours, heures) => {
    const now = new Date();
    const nextReminder = new Date();
    
    // Logique simplifiée - retourne la première heure du jour suivant
    if (heures.length > 0) {
      const [hour, minute] = heures[0].split(':');
      nextReminder.setHours(parseInt(hour), parseInt(minute), 0, 0);
      
      if (nextReminder <= now) {
        nextReminder.setDate(nextReminder.getDate() + 1);
      }
    }
    
    return nextReminder.toISOString();
  };

  const [showModal, setShowModal] = useState(false);
  const [editingRappel, setEditingRappel] = useState(null);
  const [formData, setFormData] = useState({
    medicament: '',
    heures: [''],
    jours: [],
    son: true,
    vibration: true,
    actif: true
  });

  const joursOptions = [
    { key: 'lun', label: t('reminders.monday') },
    { key: 'mar', label: t('reminders.tuesday') },
    { key: 'mer', label: t('reminders.wednesday') },
    { key: 'jeu', label: t('reminders.thursday') },
    { key: 'ven', label: t('reminders.friday') },
    { key: 'sam', label: t('reminders.saturday') },
    { key: 'dim', label: t('reminders.sunday') }
  ];

  // Ouvrir le modal d'ajout
  const handleAdd = () => {
    setEditingRappel(null);
    setFormData({
      medicament: '',
      heures: [''],
      jours: [],
      son: true,
      vibration: true,
      actif: true
    });
    setShowModal(true);
  };

  // Ouvrir le modal d'édition
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

  // Sauvegarder
  const handleSave = () => {
    if (!formData.medicament || formData.heures.length === 0 || formData.jours.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newRappel = {
      ...formData,
      id: editingRappel ? editingRappel.id : Date.now(),
      heures: formData.heures.filter(h => h.trim() !== ''),
      prochainRappel: calculateNextReminder(formData.jours, formData.heures)
    };

    if (editingRappel) {
      setRappels(rappels.map(r => r.id === editingRappel.id ? newRappel : r));
    } else {
      setRappels([...rappels, newRappel]);
    }

    setShowModal(false);
  };

  // Supprimer
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rappel ?')) {
      setRappels(rappels.filter(r => r.id !== id));
    }
  };

  // Activer/Désactiver
  const toggleActive = (id) => {
    setRappels(rappels.map(r => 
      r.id === id ? { ...r, actif: !r.actif } : r
    ));
  };

  // Ajouter une heure
  const addHeure = () => {
    setFormData({
      ...formData,
      heures: [...formData.heures, '']
    });
  };

  // Supprimer une heure
  const removeHeure = (index) => {
    setFormData({
      ...formData,
      heures: formData.heures.filter((_, i) => i !== index)
    });
  };

  // Modifier une heure
  const updateHeure = (index, value) => {
    const newHeures = [...formData.heures];
    newHeures[index] = value;
    setFormData({
      ...formData,
      heures: newHeures
    });
  };

  // Toggle jour
  const toggleJour = (jour) => {
    const newJours = formData.jours.includes(jour)
      ? formData.jours.filter(j => j !== jour)
      : [...formData.jours, jour];
    
    setFormData({
      ...formData,
      jours: newJours
    });
  };

  // Formater l'heure du prochain rappel
  const formatProchainRappel = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'Maintenant';
    } else if (diffHours < 24) {
      return `Dans ${diffHours}h`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // Statistiques
  const stats = {
    total: rappels.length,
    actifs: rappels.filter(r => r.actif).length,
    inactifs: rappels.filter(r => !r.actif).length,
    prochains24h: rappels.filter(r => {
      const next = new Date(r.prochainRappel);
      const in24h = new Date();
      in24h.setHours(in24h.getHours() + 24);
      return r.actif && next <= in24h;
    }).length
  };

  return (
    <div className="rappels">
      {/* Header */}
      <div className="rappels-header">
        <div className="header-top">
          <h1>⏰ {t('reminders.title')}</h1>
          <button className="btn-add-rappel" onClick={handleAdd}>
            + {t('reminders.addReminder')}
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="rappels-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">{t('common.total')} {t('dashboard.remindersCount')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.actifs}</div>
          <div className="stat-label">{t('reminders.active')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.inactifs}</div>
          <div className="stat-label">{t('reminders.inactive')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.prochains24h}</div>
          <div className="stat-label">{t('common.next')} 24h</div>
        </div>
      </div>

      {/* Tableau des rappels */}
      <div className="rappels-list">
        <h3>📋 {t('reminders.title')}</h3>
        {rappels.length === 0 ? (
          <div className="no-rappels">
            <div className="no-rappels-icon">⏰</div>
            <h4>{t('common.noData')}</h4>
            <p>{t('reminders.addReminder')}</p>
            <button className="btn-add-first" onClick={handleAdd}>
              {t('reminders.addReminder')}
            </button>
          </div>
        ) : (
          <div className="rappels-table-container">
            <table className="rappels-table">
              <thead>
                <tr>
                  <th>{t('reminders.medication')}</th>
                  <th>{t('reminders.times')}</th>
                  <th>{t('reminders.days')}</th>
                  <th>{t('common.next')}</th>
                  <th>{t('reminders.sound')}</th>
                  <th>{t('reminders.vibration')}</th>
                  <th>{t('common.status')}</th>
                  <th>{t('medications.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {rappels.map(rappel => (
                  <tr key={rappel.id} className={rappel.actif ? 'active-row' : 'inactive-row'}>
                    <td className="medicament-cell">
                      <strong>{rappel.medicament}</strong>
                    </td>
                    <td className="heures-cell">
                      {rappel.heures.join(', ')}
                    </td>
                    <td className="jours-cell">
                      {rappel.jours.join(', ')}
                    </td>
                    <td className="prochain-cell">
                      {formatProchainRappel(rappel.prochainRappel)}
                    </td>
                    <td className="son-cell">
                      <span className="option-icon">{rappel.son ? '🔊' : '🔇'}</span>
                      <span className="option-text">{t('reminders.sound')}</span>
                    </td>
                    <td className="vibration-cell">
                      <span className="option-icon">{rappel.vibration ? '📳' : '📴'}</span>
                      <span className="option-text">{t('reminders.vibration')}</span>
                    </td>
                    <td className="statut-cell">
                      <span className={`statut-badge ${rappel.actif ? 'actif' : 'inactif'}`}>
                        {rappel.actif ? `🔔 ${t('reminders.active')}` : `🔕 ${t('reminders.inactive')}`}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="btn-toggle-table"
                        onClick={() => toggleActive(rappel.id)}
                        title={rappel.actif ? 'Désactiver' : 'Activer'}
                      >
                        {rappel.actif ? '�' : '�'}
                      </button>
                      <button 
                        className="btn-edit-table"
                        onClick={() => handleEdit(rappel)}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete-table"
                        onClick={() => handleDelete(rappel.id)}
                        title="Supprimer"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingRappel ? t('reminders.editReminder') : t('reminders.addNewReminder')}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="rappel-form">
              {/* Médicament */}
              <div className="form-group">
                <label>{t('reminders.medication')} *</label>
                <input
                  type="text"
                  value={formData.medicament}
                  onChange={(e) => setFormData({...formData, medicament: e.target.value})}
                  placeholder={t('reminders.medicationPlaceholder')}
                />
              </div>

              {/* Heures */}
              <div className="form-group">
                <label>{t('reminders.times')} *</label>
                <div className="heures-list">
                  {formData.heures.map((heure, index) => (
                    <div key={index} className="heure-item">
                      <input
                        type="time"
                        value={heure}
                        onChange={(e) => updateHeure(index, e.target.value)}
                      />
                      {formData.heures.length > 1 && (
                        <button 
                          type="button"
                          className="btn-remove-heure"
                          onClick={() => removeHeure(index)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn-add-heure" onClick={addHeure}>
                    + {t('reminders.addTime')}
                  </button>
                </div>
              </div>

              {/* Jours */}
              <div className="form-group">
                <label>{t('reminders.selectDays')} *</label>
                <div className="jours-selector">
                  {joursOptions.map(jour => (
                    <button
                      key={jour.key}
                      type="button"
                      className={`jour-btn ${formData.jours.includes(jour.key) ? 'selected' : ''}`}
                      onClick={() => toggleJour(jour.key)}
                    >
                      {jour.label.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="form-row">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.son}
                      onChange={(e) => setFormData({...formData, son: e.target.checked})}
                    />
                    🔊 {t('reminders.enableSound')}
                  </label>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.vibration}
                      onChange={(e) => setFormData({...formData, vibration: e.target.checked})}
                    />
                    📳 {t('reminders.enableVibration')}
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.actif}
                    onChange={(e) => setFormData({...formData, actif: e.target.checked})}
                  />
                  ✅ {t('reminders.active')}
                </label>
              </div>

              {/* Boutons */}
              <div className="form-buttons">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>
                  {t('common.cancel')}
                </button>
                <button className="btn-save" onClick={handleSave}>
                  {editingRappel ? t('common.save') : t('common.add')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rappels;