import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Historique.css';

const Historique = () => {
  const { t } = useTranslation();
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtres, setFiltres] = useState({
    recherche: '',
    periode: '7j',
    dateDebut: '',
    dateFin:'',
  });

  useEffect(() => {
    fetchHistorique();
  }, []);
  const fetchHistorique = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`http://localhost:5000/medicaments?email=${user.email}`);
      
      if (response.ok) {
        const medicaments = await response.json();
        
        const historiqueGenere = generateHistoriqueFromMedicaments(medicaments);
        setHistorique(historiqueGenere);
      } else {
        console.error('Erreur lors de la récupération de l\'historique');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateHistoriqueFromMedicaments = (medicaments) => {
    const historique = [];
    let idCounter = 1;

    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      medicaments.forEach(med => {
        const heures = med.heures_prise || ['08:00'];
        heures.forEach(heure => {
             const isPris = Math.random() > 0.2;
          const retard = isPris ? Math.floor(Math.random() * 30) - 10 : null;
          
          historique.push({
            id: idCounter++,
            medicament: `${med.nom} ${med.dosage || ''}`,
            date: dateStr,
            heure: heure,
            statut: isPris ? 'pris' : 'manque',
            dosage: med.dosage || '500mg',
            forme: med.forme || 'Comprimé',
            priseEffective: isPris ? addMinutes(heure, retard) : null,
            retard: isPris ? retard : null,
            medecin: 'Dr. Martin',
            notes: isPris ? (retard > 10 ? 'Léger retard' : 'À l\'heure') : 'Oublié'
          });
        });
      });
    }
    
    return historique;
  };

  // Ajouter des minutes à une heure
  const addMinutes = (timeStr, minutes) => {
    const [hours, mins] = timeStr.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
  };

  const handleFiltreChange = (e) => {
    const { name, value } = e.target;
    setFiltres(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filtrerHistorique = () => {
    let historiqueFiltré = [...historique];

    // Filtre par recherche
    if (filtres.recherche) {
      historiqueFiltré = historiqueFiltré.filter(item =>
        item.medicament.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
        item.medecin.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(filtres.recherche.toLowerCase()))
      );
    }

    // Filtre par statut
    if (filtres.statut !== 'tous') {
      historiqueFiltré = historiqueFiltré.filter(item => item.statut === filtres.statut);
    }

    // Filtre par période
    if (filtres.periode !== 'tous') {
      const aujourdhui = new Date();
      let dateLimit;
      
      switch (filtres.periode) {
        case '7j':
          dateLimit = new Date(aujourdhui.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30j':
          dateLimit = new Date(aujourdhui.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90j':
          dateLimit = new Date(aujourdhui.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateLimit = null;
      }

      if (dateLimit) {
        historiqueFiltré = historiqueFiltré.filter(item =>
          new Date(item.date) >= dateLimit
        );
      }
    }

    // Filtre par plage de dates personnalisée
    if (filtres.dateDebut) {
      historiqueFiltré = historiqueFiltré.filter(item =>
        new Date(item.date) >= new Date(filtres.dateDebut)
      );
    }

    if (filtres.dateFin) {
      historiqueFiltré = historiqueFiltré.filter(item =>
        new Date(item.date) <= new Date(filtres.dateFin)
      );
    }

    return historiqueFiltré.sort((a, b) => new Date(b.date + ' ' + b.heure) - new Date(a.date + ' ' + a.heure));
  };

  const exporterHistorique = (format) => {
    const donneesFiltrées = filtrerHistorique();
    
    if (format === 'csv') {
      const headers = ['Date', 'Heure', 'Médicament', 'Dosage', 'Statut', 'Prise Effective', 'Retard', 'Médecin', 'Notes'];
      const csvContent = [
        headers.join(','),
        ...donneesFiltrées.map(item => [
          item.date,
          item.heure,
          item.medicament,
          item.dosage,
          item.statut,
          item.priseEffective || '-',
          item.retard ? `${item.retard}min` : '-',
          item.medecin,
          item.notes || '-'
        ].join(','))
      ].join('\\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `historique-medicaments-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else if (format === 'pdf') {
      alert('Export PDF en développement');
    }
  };

  const calculerStatistiques = () => {
    const donneesFiltrées = filtrerHistorique();
    const total = donneesFiltrées.length;
    const pris = donneesFiltrées.filter(item => item.statut === 'pris').length;
    const manques = donneesFiltrées.filter(item => item.statut === 'manque').length;
    const adherence = total > 0 ? Math.round((pris / total) * 100) : 0;
    const retardMoyen = donneesFiltrées
      .filter(item => item.statut === 'pris' && item.retard !== null)
      .reduce((acc, item, _, arr) => acc + item.retard / arr.length, 0);

    return { total, pris, manques, adherence, retardMoyen: Math.round(retardMoyen) };
  };

  const stats = calculerStatistiques();
  const donneesFiltrées = filtrerHistorique();

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
          <div className="stat-label">{t('history.totalDoses')}</div>
        </div>
        <div className="stat-card success">
          <div className="stat-number">{stats.pris}</div>
          <div className="stat-label">{t('history.successfulDoses')}</div>
        </div>
        <div className="stat-card danger">
          <div className="stat-number">{stats.manques}</div>
          <div className="stat-label">{t('history.missedDoses')}</div>
        </div>
        <div className="stat-card primary">
          <div className="stat-number">{stats.adherence}%</div>
          <div className="stat-label">{t('history.adherenceRate')}</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-number">{stats.retardMoyen}min</div>
          <div className="stat-label">{t('history.avgDelay')}</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="historique-filtres">
        <div className="filtres-row">
          <div className="filtre-group">
            <label>{t('history.search')}</label>
            <input
              type="text"
              name="recherche"
              value={filtres.recherche}
              onChange={handleFiltreChange}
              placeholder={t('history.searchPlaceholder')}
              className="filtre-input"
            />
          </div>

          <div className="filtre-group">
            <label>{t('history.status')}</label>
            <select
              name="statut"
              value={filtres.statut}
              onChange={handleFiltreChange}
              className="filtre-select"
            >
              <option value="tous">{t('history.allStatus')}</option>
              <option value="pris">{t('history.successfulDoses')}</option>
              <option value="manque">{t('history.missedDoses')}</option>
            </select>
          </div>

          <div className="filtre-group">
            <label>{t('history.period')}</label>
            <select
              name="periode"
              value={filtres.periode}
              onChange={handleFiltreChange}
              className="filtre-select"
            >
              <option value="7j">{t('history.last7Days')}</option>
              <option value="30j">{t('history.last30Days')}</option>
              <option value="90j">{t('history.last3Months')}</option>
              <option value="tous">{t('history.allPeriod')}</option>
            </select>
          </div>

          <div className="filtre-group">
            <label>{t('history.startDate')}</label>
            <input
              type="date"
              name="dateDebut"
              value={filtres.dateDebut}
              onChange={handleFiltreChange}
              className="filtre-input"
            />
          </div>

          <div className="filtre-group">
            <label>{t('history.endDate')}</label>
            <input
              type="date"
              name="dateFin"
              value={filtres.dateFin}
              onChange={handleFiltreChange}
              className="filtre-input"
            />
          </div>
        </div>

        <div className="actions-row">
          <div className="resultats-info">
            {donneesFiltrées.length} {t('history.resultsFound', { count: donneesFiltrées.length })}
          </div>
          <div className="export-buttons">
            <button
              onClick={() => exporterHistorique('csv')}
              className="btn-export"
            >
              {t('history.exportCSV')}
            </button>
            <button
              onClick={() => exporterHistorique('pdf')}
              className="btn-export"
            >
              {t('history.exportPDF')}
            </button>
          </div>
        </div>
      </div>

      {/* Tableau de l'historique */}
      <div className="historique-table-container">
        <table className="historique-table">
          <thead>
            <tr>
              <th>{t('history.date')}</th>
              <th>{t('history.time')}</th>
              <th>{t('history.medication')}</th>
              <th>{t('history.dosageForm')}</th>
              <th>{t('history.status')}</th>
              <th>{t('history.actualTime')}</th>
              <th>{t('history.delay')}</th>
              <th>{t('history.doctor')}</th>
              <th>{t('history.notes')}</th>
            </tr>
          </thead>
          <tbody>
            {donneesFiltrées.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-data">
                  <div className="no-data-content">
                    <div className="no-data-icon">📋</div>
                    <h3>{t('history.noResults')}</h3>
                    <p>{t('history.modifySearch')}</p>
                  </div>
                </td>
              </tr>
            ) : (
              donneesFiltrées.map(item => (
                <tr key={item.id} className={`historique-row ${item.statut}`}>
                  <td className="date-cell">
                    {new Date(item.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="heure-cell">{item.heure}</td>
                  <td className="medicament-cell">
                    <strong>{item.medicament}</strong>
                  </td>
                  <td className="dosage-cell">
                    <div>{item.dosage}</div>
                    <div className="forme-info">{item.forme}</div>
                  </td>
                  <td className="statut-cell">
                    <span className={`statut-badge ${item.statut}`}>
                      {item.statut === 'pris' ? `✅ ${t('history.taken')}` : `❌ ${t('history.missed')}`}
                    </span>
                  </td>
                  <td className="prise-effective-cell">
                    {item.priseEffective || '-'}
                  </td>
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


