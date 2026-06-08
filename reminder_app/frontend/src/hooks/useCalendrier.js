// hooks/useCalendrier.js
import { useState, useEffect } from 'react';
import { getMedicaments } from '../services/medicamentService';
import { generateScheduleFromMedicaments } from '../utils/calendrierUtils';

export const useCalendrier = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (!user?.email) {
          setError('Utilisateur non connecté');
          return;
        }

        const medicaments = await getMedicaments(user.email);
        setSchedule(generateScheduleFromMedicaments(medicaments));
      } catch (err) {
        setError('Erreur lors du chargement du calendrier');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    const delta = direction === 'next' ? 1 : -1;

    if (view === 'day') newDate.setDate(newDate.getDate() + delta);
    else if (view === 'week') newDate.setDate(newDate.getDate() + delta * 7);
    else if (view === 'month') newDate.setMonth(newDate.getMonth() + delta);

    setCurrentDate(newDate);
  };

  const toggleMedicationTaken = (medId) => {
    setSchedule(prev =>
      prev.map(med => med.id === medId ? { ...med, pris: !med.pris } : med)
    );
  };

  const goToDay = (day) => {
    setSelectedDate(day);
    setCurrentDate(day);
    setView('day');
  };

  return {
    currentDate, view, setView,
    selectedDate, schedule,
    loading, error,
    navigateDate, toggleMedicationTaken, goToDay
  };
};