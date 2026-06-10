
import { useState, useEffect, useMemo } from 'react';
import { getStatistiques } from '../services/statistiquesService';
import {
  buildChartJsAdherenceData,
  buildChartJsBarData,
  buildChartJsDoughnutData
} from '../utils/statistiquesUtils';

export const useStatistiques = () => {
  const [stats, setStats] = useState({
  adherenceGlobale: 0,
  prisesReussies: 0,
  prisesManquees: 0,
  prisesRetard: 0,
  donneesAdherence: [],
  donneesMedicaments: [],
  donneesRepartition: [],
  donneesTemporelles: []
});
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

        const data = await getStatistiques(user.email, periode);
        setStats(data);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [periode]); 

  const chartJsAdherenceData = useMemo(
    () => stats ? buildChartJsAdherenceData(stats.donneesAdherence) : null,
    [stats]
  );
  const chartJsBarData = useMemo(
    () => stats ? buildChartJsBarData(stats.donneesMedicaments) : null,
    [stats]
  );
  const chartJsDoughnutData = useMemo(
    () => stats ? buildChartJsDoughnutData(stats.donneesRepartition) : null,
    [stats]
  );

  return {
    stats, loading, error,
  periode, setPeriode,
  typeGraphique, setTypeGraphique,
  donneesAdherence: stats?.donneesAdherence ?? [],
  donneesTemporelles: stats?.donneesTemporelles ?? [],
  donneesRepartition: stats?.donneesRepartition ?? [],
  donneesMedicaments: stats?.donneesMedicaments ?? [],
  chartJsAdherenceData,
  chartJsBarData,
  chartJsDoughnutData
  };
};