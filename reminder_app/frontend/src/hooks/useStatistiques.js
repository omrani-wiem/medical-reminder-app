// hooks/useStatistiques.js
import { useState, useEffect, useMemo } from 'react';
import { getMedicaments } from '../services/medicamentService';
import {
  generateDonneesAdherence,
  generateDonneesTemporelles,
  generateDonneesRepartition,
  generateDonneesMedicaments,
  generateDonneesHeures,
  calculateGlobalStats,
  buildChartJsAdherenceData,
  buildChartJsBarData,
  buildChartJsDoughnutData
} from '../utils/statistiquesUtils';

export const useStatistiques = () => {
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [periode, setPeriode] = useState('30j');
  const [typeGraphique, setTypeGraphique] = useState('adherence');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.email) { setError('Utilisateur non connecté'); return; }
        const data = await getMedicaments(user.email);
        setMedicaments(data || []);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // useMemo pour éviter les recalculs inutiles
  const donneesAdherence    = useMemo(() => generateDonneesAdherence(medicaments),    [medicaments]);
  const donneesTemporelles  = useMemo(() => generateDonneesTemporelles(medicaments),  [medicaments]);
  const donneesRepartition  = useMemo(() => generateDonneesRepartition(medicaments),  [medicaments]);
  const donneesMedicaments  = useMemo(() => generateDonneesMedicaments(medicaments),  [medicaments]);
  const donneesHeures       = useMemo(() => generateDonneesHeures(medicaments),       [medicaments]);

  const stats = useMemo(
    () => calculateGlobalStats(donneesRepartition, donneesAdherence),
    [donneesRepartition, donneesAdherence]
  );

  const chartJsAdherenceData = useMemo(() => buildChartJsAdherenceData(donneesAdherence), [donneesAdherence]);
  const chartJsBarData       = useMemo(() => buildChartJsBarData(donneesMedicaments),     [donneesMedicaments]);
  const chartJsDoughnutData  = useMemo(() => buildChartJsDoughnutData(donneesRepartition),[donneesRepartition]);

  return {
    loading, error, periode, setPeriode,
    typeGraphique, setTypeGraphique,
    donneesAdherence, donneesTemporelles,
    donneesRepartition, donneesMedicaments, donneesHeures,
    stats, chartJsAdherenceData, chartJsBarData, chartJsDoughnutData
  };
};