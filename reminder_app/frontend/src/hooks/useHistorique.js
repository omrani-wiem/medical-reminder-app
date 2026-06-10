// hooks/useHistorique.js
import { useState, useEffect, useMemo } from 'react';
import { getHistoriquePrises, marquerPrise } from '../services/medicamentService';
import { formatHistorique, filtrerHistorique, calculerStatistiques, exporterCSV } from '../utils/historiqueUtils';

const FILTRES_INITIAL = {
  recherche: '', statut: 'tous',
  periode: '7j', dateDebut: '', dateFin: ''
};

export const useHistorique = () => {
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtres, setFiltres] = useState(FILTRES_INITIAL);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?.email) { setError('Utilisateur non connecté'); return; }

        // ✅ vraies prises depuis le backend
        const prises = await getHistoriquePrises(user.email);
        setHistorique(formatHistorique(prises));
      } catch (err) {
        setError('Erreur lors du chargement de l\'historique');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFiltreChange = (e) => {
    const { name, value } = e.target;
    setFiltres(prev => ({ ...prev, [name]: value }));
  };

  // ✅ marquer une prise comme prise depuis l'historique
  const handleMarquerPris = async (priseId) => {
    try {
      const now = new Date().toTimeString().slice(0, 5);
      await marquerPrise(priseId, now);
      // Mise à jour locale immédiate sans refetch
      setHistorique(prev =>
        prev.map(p => p.id === priseId
          ? { ...p, statut: 'pris', priseEffective: now }
          : p
        )
      );
    } catch (err) {
      console.error('Erreur lors du marquage:', err);
    }
  };

  const donneesFiltrees = useMemo(
    () => filtrerHistorique(historique, filtres),
    [historique, filtres]
  );

  const stats = useMemo(
    () => calculerStatistiques(donneesFiltrees),
    [donneesFiltrees]
  );

  const exporter = (format) => {
    if (format === 'csv') exporterCSV(donneesFiltrees);
    else alert('Export PDF en développement');
  };

  return {
    donneesFiltrees, stats, loading, error,
    filtres, handleFiltreChange,
    exporter, handleMarquerPris
  };
};