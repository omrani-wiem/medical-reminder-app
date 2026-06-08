// Historique.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistorique } from '../hooks/useHistorique';
import './Historique.css';

const Historique = () => {
  const { t } = useTranslation();
  const { donneesFiltrees, stats, loading, error, filtres, handleFiltreChange, exporter } = useHistorique();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="historique">
      <div className="historique-header">
        <h1>{t('history.title')}</h1>
        <p>{t('history.subtitle')}</p>
      </div>

      {/* Statistiques rapides */}
      <div className="historique-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">{t('total Doses')}</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-number">{stats.manques}</div>
          <div className="stat-label">{t('missed Doses')}</div>
        </div>
        <div className="stat-card primary">
          <div className="stat-number">{stats.adherence}%</div>
          <div className="stat-label">{t('adherence Rate')}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-number">{stats.retardMoyen}min</div>
          <div className="stat-label">{t('avg Delay')}</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="historique-filtres">
        <div className="filtres-row">
          <div className="filtre-group">
            <label>{t('history.search')}</label>
            <input type="text" name="recherche" value={filtres.recherche}
              onChange={handleFiltreChange} placeholder={t('search')} className="filtre-input" />
          </div>
          <div className="filtre-group">
            <label>{t('history.status')}</label>
            <select name="statut" value={filtres.statut}
              onChange={handleFiltreChange} className="filtre-select">
              <option value="tous">{t('history.allStatus')}</option>
              <option value="pris">{t('history.successfulDoses')}</option>
              <option value="manque">{t('history.missedDoses')}</option>
            </select>
          </div>
          <div className="filtre-group">
            <label>{t('period')}</label>
            <select name="periode" value={filtres.periode}
              onChange={handleFiltreChange} className="filtre-select">
              <option value="7j">{t('last7Days')}</option>
              <option value="30j">{t('last30Days')}</option>
              <option value="90j">{t('last3Months')}</option>
              <option value="tous">{t('allPeriod')}</option>
            </select>
          </div>
          <div className="filtre-group">
            <label>{t('start Date')}</label>
            <input type="date" name="dateDebut" value={filtres.dateDebut}
              onChange={handleFiltreChange} className="filtre-input" />
          </div>
          <div className="filtre-group">
            <label>{t('end Date')}</label>
            <input type="date" name="dateFin" value={filtres.dateFin}
              onChange={handleFiltreChange} className="filtre-input" />
          </div>
        </div>

        <div className="actions-row">
          <div className="resultats-info">
            {donneesFiltrees.length} {t('results Found', { count: donneesFiltrees.length })}
          </div>
          <div className="export-buttons">
            <button onClick={() => exporter('csv')} className="btn-export">
              {t('history.exportCSV')}
            </button>
            <button onClick={() => exporter('pdf')} className="btn-export">
              {t('history.exportPDF')}
            </button>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="historique-table-container">
        <table className="historique-table">
          <thead>
            <tr>
              <th>{t('history.date')}</th>
              <th>{t('history.time')}</th>
              <th>{t('history.medication')}</th>
              <th>{t('dosageForm')}</th>
              <th>{t('history.status')}</th>
              <th>{t('history.actualTime')}</th>
              <th>{t('history.delay')}</th>
              <th>{t('history.doctor')}</th>
              <th>{t('history.notes')}</th>
            </tr>
          </thead>
          <tbody>
            {donneesFiltrees.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  <div className="no-data-content">
                    <div className="no-data-icon">📋</div>
                    <h3>{t('noResults')}</h3>
                  </div>
                </td>
              </tr>
            ) : (
              donneesFiltrees.map(item => (
                <tr key={item.id} className={`historique-row ${item.statut}`}>
                  <td className="date-cell">
                    {new Date(item.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="heure-cell">{item.heure}</td>
                  <td className="medicament-cell"><strong>{item.medicament}</strong></td>
                  <td className="dosage-cell">
                    <div>{item.dosage}</div>
                    <div className="forme-info">{item.forme}</div>
                  </td>
                  <td className="statut-cell">
                    <span className={`statut-badge ${item.statut}`}>
                      {item.statut === 'pris' ? ` ${t('history.taken')}` : ` ${t('history.missed')}`}
                    </span>
                  </td>
                  <td className="prise-effective-cell">{item.priseEffective || '-'}</td>
                  <td className="retard-cell">
                    {item.retard !== null ? (
                      <span className={`retard-badge ${item.retard > 0 ? 'retard' : item.retard < 0 ? 'avance' : 'ponctuel'}`}>
                        {item.retard > 0 ? `+${item.retard}min` : item.retard < 0 ? `${item.retard}min` : t('history.onTime')}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="medecin-cell">{item.medecin}</td>
                  <td className="notes-cell">
                    <div className="notes-text">{item.notes || '-'}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Historique;