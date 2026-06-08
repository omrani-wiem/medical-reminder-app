// Calendrier.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCalendrier } from '../hooks/useCalendrier';
import {
  getDaysInMonth, getWeekDays, getMedicationsForDate,
  formatDate, isToday, isCurrentMonth
} from '../utils/calendrierUtils';
import './Calendrier.css';

const Calendrier = () => {
  const { t } = useTranslation();
  const {
    currentDate, view, setView,
    schedule, loading, error,
    navigateDate, toggleMedicationTaken, goToDay
  } = useCalendrier();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  const medsForDate = (date) => getMedicationsForDate(schedule, date);

  return (
    <div className="calendrier">

      {/* Header */}
      <div className="header-top">
        <h1>{t('calender.title')}</h1>
        <div className="view-selector">
          {['day', 'week', 'month'].map(v => (
            <button
              key={v}
              className={`view-btn ${view === v ? 'active' : ''}`}
              onClick={() => setView(v)}
            >
              {t(`calender.${v}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="calendrier-navigation">
        <button className="nav-btn" onClick={() => navigateDate('prev')}>‹</button>
        <h2 className="current-period">
          {view === 'day' && formatDate(currentDate)}
          {view === 'week' && `${t('calendar.weekOf')} ${currentDate.toLocaleDateString('fr-FR')}`}
          {view === 'month' && currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </h2>
        <button className="nav-btn" onClick={() => navigateDate('next')}>›</button>
      </div>

      {/* Vue Jour */}
      {view === 'day' && (
        <div className="day-view">
          <div className="day-header"><h3>{formatDate(currentDate)}</h3></div>
          <div className="day-schedule">
            {medsForDate(currentDate).length === 0 ? (
              <div className="no-medications">
                <div className="no-medications-icon">💊</div>
                <p>{t('calendar.noMedications')}</p>
              </div>
            ) : (
              medsForDate(currentDate)
                .sort((a, b) => a.heure.localeCompare(b.heure))
                .map(med => (
                  <div key={med.id} className={`medication-item ${med.pris ? 'taken' : 'pending'}`}>
                    <div className="medication-time">{med.heure}</div>
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
      {view === 'week' && (
        <div className="week-view">
          <div className="week-grid">
            {getWeekDays(currentDate).map(day => (
              <div key={day.toISOString()} className={`week-day ${isToday(day) ? 'today' : ''}`}>
                <div className="week-day-header">
                  <div className="day-name">{day.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                  <div className="day-number">{day.getDate()}</div>
                </div>
                <div className="week-day-medications">
                  {medsForDate(day).map(med => (
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
            {getDaysInMonth(currentDate).map(day => (
              <div
                key={day.toISOString()}
                className={`month-day ${!isCurrentMonth(day, currentDate) ? 'other-month' : ''} ${isToday(day) ? 'today' : ''}`}
                onClick={() => goToDay(day)}
              >
                <div className="month-day-number">{day.getDate()}</div>
                <div className="month-day-medications">
                  {medsForDate(day).slice(0, 3).map(med => (
                    <div
                      key={med.id}
                      className={`month-medication ${med.pris ? 'taken' : 'pending'}`}
                      style={{ backgroundColor: med.couleur }}
                    >
                      <span className="month-med-time">{med.heure}</span>
                    </div>
                  ))}
                  {medsForDate(day).length > 3 && (
                    <div className="month-medication more">+{medsForDate(day).length - 3}</div>
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
          {['taken', 'pending', 'missed'].map(status => (
            <div key={status} className="legend-item">
              <div className={`legend-color ${status}`}></div>
              <span>{t(`calendar.${status}`)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Résumé du jour */}
      <div className="day-summary">
        <h4>{t('calendar.todaySummary')}</h4>
        <div className="summary-stats">
          <div className="summary-stat">
            <div className="stat-number">{medsForDate(new Date()).filter(m => m.pris).length}</div>
            <div className="stat-label">{t('calendar.taken')}</div>
          </div>
          <div className="summary-stat">
            <div className="stat-number">{medsForDate(new Date()).filter(m => !m.pris).length}</div>
            <div className="stat-label">{t('calendar.remaining')}</div>
          </div>
          <div className="summary-stat">
            <div className="stat-number">{medsForDate(new Date()).length}</div>
            <div className="stat-label">{t('common.total')}</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Calendrier;