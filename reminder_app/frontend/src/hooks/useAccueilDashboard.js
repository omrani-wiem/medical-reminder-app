// hooks/useAccueilDashboard.js
import { useState, useEffect } from 'react';
import { getMedicaments } from '../services/medicamentService';
import { getStatistiques } from '../services/statistiquesService';
import { preparerRappels } from '../utils/dashboardUtils';

export const useAccueilDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [medicaments, setMedicaments] = useState([]);
  const [prochainRappels, setProchainRappels] = useState([]);
  const [statistiques, setStatistiques] = useState({
    adherence: 0,
    medicamentsPris: 0,
    medicamentsManques: 0,
    stock: { enStock: 0, bientotEpuise: 0, epuise: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Horloge
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch données réelles
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user?.email) { setError('Utilisateur non connecté'); return; }

        // Récupérer médicaments et statistiques en parallèle
        const [meds, stats] = await Promise.all([
          getMedicaments(user.email),
          getStatistiques(user.email, '7j')
        ]);

        setMedicaments(meds || []);
        setProchainRappels(preparerRappels(meds || []));

        // Stats viennent du vrai backend
        setStatistiques({
          adherence: stats.adherenceGlobale,
          medicamentsPris: stats.prisesReussies,
          medicamentsManques: stats.prisesManquees,
          stock: {
            enStock: (meds || []).filter(m => (m.stock || 0) > (m.stockMin || 10)).length,
            bientotEpuise: (meds || []).filter(m => {
              const s = m.stock || 0;
              const min = m.stockMin || 10;
              return s > 0 && s <= min;
            }).length,
            epuise: (meds || []).filter(m => (m.stock || 0) === 0).length
          }
        });

      } catch (err) {
        setError('Erreur lors du chargement');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const marquerCommePris = (rappelId) => {
    setProchainRappels(prev =>
      prev.map(r => r.id === rappelId ? { ...r, taken: true } : r)
    );
  };

  return {
    currentTime, medicaments, prochainRappels,
    statistiques, loading, error, marquerCommePris
  };
};