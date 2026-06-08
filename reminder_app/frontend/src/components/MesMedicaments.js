// MesMedicaments.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMesMedicaments } from '../hooks/useMesMedicaments';
import { getStockStatus, getStockColor, FORMES_MEDICAMENT } from '../utils/medicamentUtils';
import './MesMedicaments.css';

const MesMedicaments = () => {
  const { t } = useTranslation();
  const {
    medicaments, medicamentsFiltres,
    loading, error,
    showAddForm, editingMed, formData,
    searchTerm, setSearchTerm,
    filterType, setFilterType,
    handleInputChange, handleSubmit,
    handleEdit, handleDelete,
    ouvrirFormulaire, resetForm
  } = useMesMedicaments();

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="mes-medicaments">

      {/* Header */}
      <div className="medicaments-header">
        <div className="header-top">
          <h1>{t('medications.title')}</h1>
          <button className="btn-add-medicament" onClick={ouvrirFormulaire}>
            {t('medications.add')}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Recherche + filtre */}
        <div className="medicaments-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder={t('medications.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-controls">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
              <option value="tous">{t('medications.filterAll')}</option>
              <option value="faible-stock">{t('medications.filterLowStock')}</option>
              <option value="epuise">{t('medications.filterOutOfStock')}</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="medicaments-stats">
          <div className="stat-card">
            <div className="stat-number">{medicaments.length}</div>
            <div className="stat-label">{t('total')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{medicaments.filter(m => m.stock <= m.stockMin && m.stock > 0).length}</div>
            <div className="stat-label">{t('medications.filterLowStock')}</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{medicaments.filter(m => m.stock === 0).length}</div>
            <div className="stat-label">{t('medications.filterOutOfStock')}</div>
          </div>
        </div>
      </div>

      {/* Modal formulaire */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingMed ? t('medications.edit') : t('medications.addNew')}</h3>
              <button className="btn-close" onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="medicament-form">
              <div className="form-row">
                <div className="form-group">
                  <label>{t('medications.medicationName')} <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>{t('medications.dosageLabel')} <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" name="dosage" value={formData.dosage}
                    onChange={handleInputChange} placeholder={t('medications.dosagePlaceholder')} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('medications.formLabel')}</label>
                  <select name="forme" value={formData.forme} onChange={handleInputChange}>
                    {FORMES_MEDICAMENT.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('medications.color')}</label>
                  <input type="text" name="couleur" value={formData.couleur}
                    onChange={handleInputChange} placeholder={t('medications.colorPlaceholder')} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('medications.frequencyLabel')} <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" name="frequence" value={formData.frequence}
                    onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>{t('medications.duration')} <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" name="duree" value={formData.duree}
                    onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('medications.currentStock')}</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" />
                </div>
                <div className="form-group">
                  <label>{t('medications.minStock')}</label>
                  <input type="number" name="stockMin" value={formData.stockMin} onChange={handleInputChange} min="0" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('medications.prescribingDoctor')}</label>
                  <input type="text" name="medecin" value={formData.medecin}
                    onChange={handleInputChange} placeholder={t('medications.doctorPlaceholder')} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('medications.startDate')}</label>
                  <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>{t('medications.endDate')}</label>
                  <input type="date" name="dateFin" value={formData.dateFin} onChange={handleInputChange} />
                </div>
              </div>

              <div className="form-group">
                <label>{t('medications.instructions')}</label>
                <textarea name="instructions" value={formData.instructions}
                  onChange={handleInputChange} rows="3"
                  placeholder={t('medications.instructionsPlaceholder')} />
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn-save">
                  {editingMed ? t('common.save') : t('common.add')}
                </button>
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tableau */}
      <div className="medicaments-table-container">
        <table className="medicaments-table">
          <thead>
            <tr>
              <th>{t('medications.name')}</th>
              <th>{t('medications.dosage')}</th>
              <th>{t('medications.frequency')}</th>
              <th>{t('medications.duration')}</th>
              <th>{t('medications.doctor')}</th>
              <th>{t('medications.stock')}</th>
              <th>{t('medications.nextDose')}</th>
              <th>{t('medications.instructions')}</th>
              <th>{t('medications.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {medicamentsFiltres.length === 0 ? (
              <tr>
                <td colSpan="9">
                  <div className="no-results">
                    <div className="no-results-icon">💊</div>
                    <h3>Aucun médicament trouvé</h3>
                    <p>Modifiez vos critères de recherche ou ajoutez un médicament.</p>
                  </div>
                </td>
              </tr>
            ) : (
              medicamentsFiltres.map((medicament, index) => {
                const stockStatus = getStockStatus(medicament.stock, medicament.stockMin);
                return (
                  <tr key={medicament._id || medicament.id || index}>
                    <td><strong>{medicament.nom}</strong></td>
                    <td>
                      <div>{medicament.dosage}</div>
                      <div className="forme-info">{medicament.forme} {medicament.couleur}</div>
                    </td>
                    <td>{medicament.frequence}</td>
                    <td>{medicament.duree}</td>
                    <td>{medicament.medecin}</td>
                    <td>
                      <div className="stock-value" style={{ color: getStockColor(stockStatus) }}>
                        {medicament.stock} unités
                      </div>
                      <div className={`stock-status-badge ${stockStatus}`}>
                        {stockStatus === 'epuise' && '🔴 Épuisé'}
                        {stockStatus === 'faible' && '🟡 Stock faible'}
                        {stockStatus === 'normal' && '🟢 Stock OK'}
                      </div>
                    </td>
                    <td>{medicament.prochainePrise || '-'}</td>
                    <td><div className="instructions-text-table">{medicament.instructions || '-'}</div></td>
                    <td>
                      <button className="btn-edit-table" onClick={() => handleEdit(medicament)} title="Modifier">✏️</button>
                      <button className="btn-delete-table" onClick={() => handleDelete(medicament._id || medicament.id)} title="Supprimer">🗑️</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MesMedicaments;