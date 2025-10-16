import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Calendrier.css';

const Calendrier = () => {
    const { t } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [medicationScedule, setMedicationSchedule] = useState({});
    const [loading, setLoading] = useState(true);

     // Récupérer les médicaments et générer le calendrier
  useEffect(() => {
    fetchMedicamentsAndGenerateSchedule();
  }, []);

  const fetchMedicamentsAndGenerateSchedule = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`http://localhost:5000/medicaments?email=${user.email}`);
      
      if (response.ok) {
        const medicaments = await response.json();

        const schedule = generateScheduleFromMedicaments(medicaments);
        setMedicationSchedule(schedule);
      }else {
        console.error('Erreur lors de la récupération des médicaments');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Générer le planning sur 30 jours
  const generateScheduleFromMedicaments = (medicaments) => {
    const schedule = [];
    let idCounter = 1;
    
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        medicaments.forEach(med => {
        const heures = med.heures_prise || ['08:00'];
        heures.forEach(heure => {
          schedule.push({
            id: idCounter++,
            medicament: `${med.nom} ${med.dosage || ''}`,
            heure: heure,
            date: dateStr,
            pris: false, // Par défaut non pris
            couleur: getRandomColor()
          });
        });
      });
    }
    
    return schedule;
  };


const getRandomColor = () => {
    const colors = ['#3498db', '#27ae60', '#f39c12', '#9b59b6', '#e74c3c'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startCalendar = new Date(firstDay);
    startCalendar.setDate(startCalendar.getDate() - firstDay.getDay());

    const days = [];
    const endCalendar = new Date(startCalendar);
    endCalendar.setDate(endCalendar.getDate() + 42); // 6 semaines

    const current = new Date(startCalendar);
    while (current < endCalendar) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

// obetenir les medicaments pour une date donnée
const getMedicationsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];// Format YYYY-MM-DD
    return medicationScedule.filter(med => med.date === dateStr);// Filtrer par date
};

//obtenir les médicaments pour la semaine
const getWeekDays = () => {
  const startOfWeek = new Date(currentDate);
  const diff = startOfWeek.getDate() - startOfWeek.getDay();
  startOfWeek.setDate(diff);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
}
  return days;
};

//Navigation
const navigateDate = (direction) => {
  const newDate = new Date(currentDate);
  if (view === 'day') {
    newDate.setDate(newDate.getDate() + (direction  === 'next' ? 1 : -1));
  } else if (view === 'week') {
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
  } else if (view === 'month') {
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
  }
  setCurrentDate(newDate);
};

// Marquer comme pris/non pris(a ameliorer n'est pas complete)
  const toggleMedicationTaken = (medId) => {
    console.log('Toggle medication', medId);
  };

  //formater la date
  const formatDate = (date) => {
     return date.toLocaleDateString('fr-FR', { // Méthode JavaScript qui transforme une date en chaîne lisible selon un format donné ici on veut le format francais
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr) => {
    return timeStr;
  };
   
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString()
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="calendrier">
      {/* Header */}
      <div className="header-top">
        <h1>{t('calender.title')}</h1>
        <div className="view-selector">
          <button
             className={`view-btn ${view === 'day' ? 'active' : ''}`}
              onClick={() => setView('day')}
          >
            {t('calender.day')}
          </button>
          <button 
              className={`view-btn ${view === 'week' ? 'active' : ''}`}
              onClick={() => setView('week')}
            >
            {t('calender.week')}
          </button>
          <button 
              className={`view-btn ${view === 'month' ? 'active' : ''}`}
              onClick={() => setView('month')}
            >
              {t('calendar.month')}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="calendrier-navigation">
       <button className="nav-btn" onClick={() => navigateDate('prev')}>
            ‹
          </button>
          <h2 className="current-period">
            {view === 'day' && formatDate(currentDate)}
            {view === 'week' && `${t('calendar.weekOf')} ${currentDate.toLocaleDateString('fr-FR')}`}
            {view === 'month' && currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </h2>
          <button className="nav-btn" onClick={() => navigateDate('next')}>
             ›
          </button>
        </div>

      {/* Vue Jour */}
      {view === 'day' && (
        <div className="day-view">
          <div className="day-header">
            <h3>{formatDate(currentDate)}</h3>
          </div>
          <div className="day-schedule">
            {getMedicationsForDate(currentDate).length === 0 ? (
              <div className="no-medications">
                <div className="no-medications-icon">💊</div>
                <p>{t('calendar.noMedications')}</p>
              </div>
              //sinon on va afficher la liste des médicaments
            ) : (
              getMedicationsForDate(currentDate)
              .sort((a, b) => a.heure.localeCompare(b.heure))//trier par heure et pour chaque medicament trie on va faire le traitement suivant et → ajoute la classe `taken` si med.pris est vrai, sinon `pending`.
              .map(med => (
                <div key={med.id} className={`medication-item ${med.pris ? 'taken' : 'pending'}`}>
                  <div className="medication-time">
                      {formatTime(med.heure)}
                    </div>
                    <div className="medication-info">
                      <div className="medication-name">{med.medicament}</div>
                      <div className="medication-status">
                        {med.pris ? `✅ ${t('calendar.taken')}` : `⏰ ${t('calendar.toTake')}`}
                      </div>
                      <div className="medication-actions">
                      <button 
                        className={`btn-toggle ${med.pris ? 'btn-untake' : 'btn-take'}`}
                        onClick={() => toggleMedicationTaken(med.id)}
                      >
                        {med.pris ? t('calendar.cancel') : t('calendar.take')}
                      </button>
                    </div>
                  </div>
                          </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* Vue Semaine */}
       {/* Vue Semaine */}
      {view === 'week' && (
        <div className="week-view">
          <div className="week-grid">
            {getWeekDays().map(day => (
              <div key={day.toISOString()} className={`week-day ${isToday(day) ? 'today' : ''}`}>
                <div className="week-day-header">
                  <div className="day-name">
                    {day.toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </div>
                  <div className="day-number">
                    {day.getDate()}
                  </div>
                </div>
                <div className="week-day-medications">
                  {getMedicationsForDate(day).map(med => (
                    <div 
                      key={med.id} 
                      className={`week-medication ${med.pris ? 'taken' : 'pending'}`}
                      style={{ borderLeftColor: med.couleur }}
                    >
                      <div className="week-med-time">{med.heure}</div>
                      <div className="week-med-name">{med.medicament}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Vue Mois */}
      {view === 'month' && (
        <div className="month-view">
          <div className="month-header">
            <div className="weekdays">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
          </div>
          <div className="month-grid">
            {getDaysInMonth().map(day => (
              <div 
                key={day.toISOString()} 
                className={`month-day ${!isCurrentMonth(day) ? 'other-month' : ''} ${isToday(day) ? 'today' : ''}`}
                onClick={() => {
                  setSelectedDate(day);
                  setCurrentDate(day);
                  setView('day');
                }}
              >
                <div className="month-day-number">
                  {day.getDate()}
                </div>
                <div className="month-day-medications">
                  {getMedicationsForDate(day).slice(0, 3).map(med => (
                    <div 
                      key={med.id} 
                      className={`month-medication ${med.pris ? 'taken' : 'pending'}`}
                      style={{ backgroundColor: med.couleur }}
                    >
                      <span className="month-med-time">{med.heure}</span>
                    </div>
                  ))}
                  {getMedicationsForDate(day).length > 3 && (
                    <div className="month-medication more">
                      +{getMedicationsForDate(day).length - 3}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Légende */}
      <div className="calendrier-legend">
       <h4>{t('calendar.legend')}</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color taken"></div>
            <span>{t('calendar.taken')}</span>
          </div>
          <div className="legend-item">
            <div className="legend-color pending"></div>
            <span>{t('calendar.toTake')}</span>
          </div>
          <div className="legend-item">
            <div className="legend-color missed"></div>
            <span>{t('calendar.missed')}</span>
          </div>
        </div>
      </div>
      {/* Résumé du jour */}
      <div className="day-summary">
        <h4>{t('calendar.todaySummary')}</h4>
        <div className="summary-stats">
          <div className="summary-stat">
            <div className="stat-number">{getMedicationsForDate(new Date()).filter(m => m.pris).length}</div>
            <div className="stat-label">{t('calendar.taken')}</div>
          </div>
          <div className="summary-stat">
            <div className="stat-number">{getMedicationsForDate(new Date()).filter(m => !m.pris).length}</div>
            <div className="stat-label">{t('calendar.remaining')}</div>
          </div>
          <div className="summary-stat">
            <div className="stat-number">{getMedicationsForDate(new Date()).length}</div>
            <div className="stat-label">{t('common.total')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendrier;



