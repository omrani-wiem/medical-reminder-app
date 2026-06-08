// Rappels.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRappels } from '../hooks/useRappels';
import { JOURS_OPTIONS, formatProchainRappel } from '../utils/rappelUtils';
import './Rappels.css';

const Rappels = () => {
  const { t } = useTranslation();
  const {
    rappels, loading, error, stats,
    showModal, editingRappel, formData,
    handleAdd, handleEdit, handleSave, handleDelete,
    toggleActive, resetForm,
    addHeure, removeHeure, updateHeure,
    toggleJour, updateFormField
  } = useRappels();

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="rappels">

      {/* Header */}
      <div className="rappels-header">
        {error && <div className="error-message">{error}</div>}
        <button className="btn-add-rappel" onClick={handleAdd}>
          + {t('reminders.addReminder')}
        </button>
      </div>

      {/* Stats */}
      <div className="rappels-stats">
        {[
          { value: stats.total, label: `${t('total')} ${t('dashboard.remindersCount')}` },
          { value: stats.actifs, label: t('reminders.active') },
          { value: stats.inactifs, label: t('reminders.inactive') },
          { value: stats.prochains24h, label: '< 24h' }
        ].map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-number">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Liste */}
      <div className="rappels-list">
        {rappels.length === 0 ? (
          <div className="no-rappels">
            <h4>{t('common.noData')}</h4>
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
                  <th>{t('common.status')}</th>
                  <th>{t('medications.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {rappels.map(rappel => (
                  <tr key={rappel.id} className={rappel.actif ? 'active-row' : 'inactive-row'}>
                    <td><strong>{rappel.medicament}</strong></td>
                    <td>{rappel.heures.join(', ')}</td>
                    <td>{rappel.jours.join(', ')}</td>
                    <td>
                      <span className={`statut-badge ${rappel.actif ? 'actif' : 'inactif'}`}>
                        {rappel.actif ? `🔔 ${t('reminders.active')}` : `🔕 ${t('reminders.inactive')}`}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="btn-toggle-table"
                        onClick={() => toggleActive(rappel.id)}
                        title={rappel.actif ? 'Désactiver' : 'Activer'}>
                        {rappel.actif ? '⏸️' : '▶️'}
                      </button>
                      <button className="btn-edit-table"
                        onClick={() => handleEdit(rappel)} title="Modifier">✏️</button>
                      <button className="btn-delete-table"
                        onClick={() => handleDelete(rappel.id)} title="Supprimer">🗑️</button>
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
              <button className="btn-close" onClick={resetForm}>×</button>
            </div>

            <div className="rappel-form">

              {/* Médicament */}
              <div className="form-group">
                <label>{t('reminders.medication')} *</label>
                <input type="text" value={formData.medicament}
                  onChange={(e) => updateFormField('medicament', e.target.value)}
                  placeholder={t('reminders.medicationPlaceholder')} />
              </div>

              {/* Heures */}
              <div className="form-group">
                <label>{t('reminders.times')} *</label>
                <div className="heures-list">
                  {formData.heures.map((heure, index) => (
                    <div key={index} className="heure-item">
                      <input type="time" value={heure}
                        onChange={(e) => updateHeure(index, e.target.value)} />
                      {formData.heures.length > 1 && (
                        <button type="button" className="btn-remove-heure"
                          onClick={() => removeHeure(index)}>×</button>
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
                  {JOURS_OPTIONS.map(jour => (
                    <button key={jour.key} type="button"
                      className={`jour-btn ${formData.jours.includes(jour.key) ? 'selected' : ''}`}
                      onClick={() => toggleJour(jour.key)}>
                      {jour.label.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="form-row">
                {[
                  { name: 'son', label: `🔊 ${t('reminders.enableSound')}` },
                  { name: 'vibration', label: `📳 ${t('reminders.enableVibration')}` },
                  { name: 'actif', label: `✅ ${t('reminders.active')}` }
                ].map(opt => (
                  <div className="form-group" key={opt.name}>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={formData[opt.name]}
                        onChange={(e) => updateFormField(opt.name, e.target.checked)} />
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>

              {/* Boutons */}
              <div className="form-buttons">
                <button className="btn-cancel" onClick={resetForm}>{t('common.cancel')}</button>
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