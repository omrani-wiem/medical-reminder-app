// AjoutMedicament.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAjoutMedicament } from '../hooks/useAjoutMedicament';
import { FORMES_MEDICAMENT, FREQUENCES_MEDICAMENT } from '../utils/medicamentUtils';
import './AjoutMedicament.css';

function AjoutMedicament() {
  const navigate = useNavigate();
  const { formData, handleInputChange, handleSubmit, goToMedicaments, loading, error } = useAjoutMedicament();

  return (
    <div className="ajout-medicament-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/dashboard/medicaments')}>
          ← Retour
        </button>
        <h1>Ajouter un nouveau médicament</h1>
      </div>

      <div className="form-container">
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="medicament-form">
          {/* Informations générales */}
          <div className="form-section">
            <h3>Informations générales</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Nom du médicament *</label>
                <input type="text" name="nom" value={formData.nom}
                  onChange={handleInputChange} placeholder="Ex: Doliprane" required />
              </div>
              <div className="form-group">
                <label>Dosage *</label>
                <input type="text" name="dosage" value={formData.dosage}
                  onChange={handleInputChange} placeholder="Ex: 500mg" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Forme</label>
                <select name="forme" value={formData.forme} onChange={handleInputChange}>
                  {FORMES_MEDICAMENT.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Couleur</label>
                <input type="text" name="couleur" value={formData.couleur}
                  onChange={handleInputChange} placeholder="Ex: Blanc" />
              </div>
            </div>
          </div>

          {/* Fréquence et durée */}
          <div className="form-section">
            <h3>Fréquence et durée</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Fréquence</label>
                <select name="frequence" value={formData.frequence} onChange={handleInputChange}>
                  <option value="">Sélectionner...</option>
                  {FREQUENCES_MEDICAMENT.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Durée (jours)</label>
                <input type="number" name="duree" value={formData.duree}
                  onChange={handleInputChange} placeholder="Ex: 7" min="1" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date de début</label>
                <input type="date" name="dateDebut" value={formData.dateDebut} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Date de fin</label>
                <input type="date" name="dateFin" value={formData.dateFin} onChange={handleInputChange} />
              </div>
            </div>
          </div>

          {/* Stock */}
          <div className="form-section">
            <h3>Gestion du stock</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Stock actuel</label>
                <input type="number" name="stock" value={formData.stock}
                  onChange={handleInputChange} placeholder="Ex: 30" min="0" />
              </div>
              <div className="form-group">
                <label>Stock minimum</label>
                <input type="number" name="stockMin" value={formData.stockMin}
                  onChange={handleInputChange} placeholder="Ex: 5" min="0" />
              </div>
            </div>
          </div>

          {/* Informations médicales */}
          <div className="form-section">
            <h3>Informations médicales</h3>
            <div className="form-group">
              <label>Médecin prescripteur</label>
              <input type="text" name="medecin" value={formData.medecin}
                onChange={handleInputChange} placeholder="Dr. Dupont" />
            </div>
            <div className="form-group">
              <label>Instructions spéciales</label>
              <textarea name="instructions" value={formData.instructions}
                onChange={handleInputChange} rows="3"
                placeholder="Ex: À prendre avec de l'eau..." />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={goToMedicaments}>
              Annuler
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Ajout en cours...' : 'Ajouter le médicament'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AjoutMedicament;