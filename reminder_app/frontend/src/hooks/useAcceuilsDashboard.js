
import { useState, useEffect } from 'react';
import { getMedicaments } from '../services/medicamentService';
import { calculerStatistiquesAdherence, preparerRappels } from '../utils/dashboardUtils';

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
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);// (function , delay )
    return () => clearInterval(timer);
  }, []);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));

        if (!user?.email) {
          setError('Utilisateur non connecté');
          return;
        }

        const data = await getMedicaments(user.email);
        setMedicaments(data || []);
        setProchainRappels(preparerRappels(data || []));
        setStatistiques(calculerStatistiquesAdherence(data || []));
      } catch (err) {
        setError('Erreur lors du chargement des médicaments');
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

  return { currentTime, medicaments, prochainRappels, statistiques, loading, error, marquerCommePris };
};