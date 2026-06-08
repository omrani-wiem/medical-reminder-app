// Statistiques.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, Legend
} from 'recharts';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip,
  Legend as ChartLegend, CategoryScale, LinearScale,
  BarElement, Title, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Line as ChartLine } from 'react-chartjs-2';
import { useStatistiques } from '../hooks/useStatistiques';
import { CHART_OPTIONS } from '../utils/statistiquesUtils';
import './Statistiques.css';

ChartJS.register(ArcElement, ChartTooltip, ChartLegend, CategoryScale,
  LinearScale, BarElement, Title, PointElement, LineElement, Filler);
ChartJS.defaults.font.family = "'Inter', sans-serif";
ChartJS.defaults.font.size = 12;
ChartJS.defaults.color = '#6c757d';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="tooltip-label">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="tooltip-value" style={{ color: entry.color }}>
          {`${entry.dataKey}: ${entry.value}${entry.dataKey.includes('adherence') ? '%' : ''}`}
        </p>
      ))}
    </div>
  );
};

const Statistiques = () => {
  const { t } = useTranslation();
  const {
    loading, error, periode, setPeriode,
    typeGraphique, setTypeGraphique,
    donneesAdherence, donneesTemporelles,
    donneesRepartition, donneesMedicaments,
    stats, chartJsAdherenceData, chartJsDoughnutData
  } = useStatistiques();

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="statistiques">

      {/* Contrôles */}
      <div className="statistiques-controls">
        <div className="control-group">
          <label>{t('Period')}</label>
          <select value={periode} onChange={(e) => setPeriode(e.target.value)} className="control-select">
            <option value="7j">{t('last 7 Days')}</option>
            <option value="30j">{t('last 30 Days')}</option>
            <option value="90j">{t('last 3 Months')}</option>
            <option value="1an">{t('one Year')}</option>
          </select>
        </div>
        <div className="control-group">
          <label>{t('chartType')}</label>
          <select value={typeGraphique} onChange={(e) => setTypeGraphique(e.target.value)} className="control-select">
            <option value="adherence">{t('global Adherence')}</option>
            <option value="medicaments">{t('by Medication')}</option>
            <option value="temporel">{t('time Evolution')}</option>
            <option value="heures">{t('time Distribution')}</option>
          </select>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="stats-overview">
        {[
          { value: `${stats.adherenceGlobale}%`, label: t('statistics.globalAdherence'), type: 'primary' },
          { value: stats.prisesReussies, label: t('successful Doses'), type: 'success' },
          { value: stats.prisesManquees, label: t('missed Doses'), type: 'danger' },
          { value: stats.prisesRetard, label: t('delayed Doses'), type: 'warning' }
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.type}`}>
            <div className="stat-content">
              <div className="stat-number">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="charts-grid">

        {/* Adhérence quotidienne — Recharts */}
        <div className="chart-container">
          <div className="chart-header"><h3>{t('Daily Adherence')}</h3></div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={donneesAdherence}>
                <defs>
                  <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3498db" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3498db" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="jour" stroke="#7f8c8d" fontSize={11} />
                <YAxis stroke="#7f8c8d" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="adherence"
                  stroke="#3498db" fill="url(#colorAdherence)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tendance hebdo — Chart.js */}
        <div className="chart-container">
          <div className="chart-header"><h3>{t('weekly Trend')}</h3></div>
          <div className="chart-content">
            <ChartLine data={chartJsAdherenceData} options={CHART_OPTIONS} height={300} />
          </div>
        </div>

        {/* Répartition — Recharts PieChart */}
        <div className="chart-container">
          <div className="chart-header"><h3>{t('statistics.doseDistribution')}</h3></div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={donneesRepartition} cx="50%" cy="50%"
                  outerRadius={100} innerRadius={40} paddingAngle={5} dataKey="value">
                  {donneesRepartition.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition — Chart.js Doughnut */}
        <div className="chart-container">
          <div className="chart-header"><h3>{t('statistics.distribution')}</h3></div>
          <div className="chart-content">
            <Doughnut data={chartJsDoughnutData}
              options={{ ...CHART_OPTIONS, cutout: '60%', plugins: { ...CHART_OPTIONS.plugins, legend: { position: 'bottom' } } }}
              height={300} />
          </div>
        </div>

        {/* Évolution mensuelle — Recharts LineChart */}
        <div className="chart-container large">
          <div className="chart-header"><h3>{t('statistics.monthlyEvolution')}</h3></div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donneesTemporelles}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" stroke="#7f8c8d" fontSize={11} />
                <YAxis stroke="#7f8c8d" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="adherence" stroke="#3498db" strokeWidth={3}
                  dot={{ fill: '#3498db', strokeWidth: 2, r: 6 }} name="Adhérence (%)" />
                <Line type="monotone" dataKey="prises" stroke="#27ae60" strokeWidth={2}
                  dot={{ fill: '#27ae60', strokeWidth: 2, r: 4 }} name="Prises totales" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Statistiques;