import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler } from 'chart.js';
import { Doughnut, Bar as ChartBar, Line as ChartLine } from 'react-chartjs-2';
import './Statistiques.css';


ChartJS.defaults.font.family = "'Inter', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif";
ChartJS.defaults.font.size = 12;
ChartJS.defaults.color = '#6c757d';


ChartJS.register(
  ArcElement,
  ChartTooltip,
  ChartLegend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Filler
);

const Statistiques = () => {
  const { t } = useTranslation();
  const [periode, setPeriode] = useState('30j');
  const [typeGraphique, setTypeGraphique] = useState('adherence');
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    fetchMedicaments();
  }, []);

  const fetchMedicaments = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch(`http://localhost:5000/medicaments?email=${user.email}`);
      
      if (response.ok) {
        const data = await response.json();
        setMedicaments(data);
      } else {
        console.error('Erreur lors de la récupération des médicaments');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };


  const generateDonneesAdherence = () => {
    if (medicaments.length === 0) return [];
    
    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const aujourdhui = new Date();
    
    return jours.map((jour, index) => {
    
      const jourSemaine = aujourdhui.getDay();
      const joursDepuisLundi = jourSemaine === 0 ? 6 : jourSemaine - 1;
      const dateJour = new Date(aujourdhui);
      dateJour.setDate(aujourdhui.getDate() - joursDepuisLundi + index);
      
    
      let prisesAttenduesTotales = 0;
      medicaments.forEach(med => {
        const dateDebut = new Date(med.dateDebut);
        const dateFin = med.dateFin ? new Date(med.dateFin) : null;
        
        
        if (dateJour >= dateDebut && (!dateFin || dateJour <= dateFin)) {
          const frequence = parseInt(med.frequence) || 1;
          prisesAttenduesTotales += frequence;
        }
      });
      
      // Calcul du taux de base
      const tauxBase = medicaments.length === 1 ? 0.95 : 
                       medicaments.length === 2 ? 0.92 :
                       medicaments.length === 3 ? 0.88 : 0.85;
      
      
      const variationJour = ((index * 7) % 10 - 5) / 100; 
      const tauxAdherence = Math.max(0.75, Math.min(1.0, tauxBase + variationJour));
      
      const prises = Math.round(prisesAttenduesTotales * tauxAdherence);
      const manques = prisesAttenduesTotales - prises;
      const adherence = prisesAttenduesTotales > 0 ? Math.round((prises / prisesAttenduesTotales) * 100) : 100;
      
      return { jour, adherence, prises, manques, total: prisesAttenduesTotales };
    });
  };

  
  const generateDonneesTemporelles = () => {
    if (medicaments.length === 0) return [];
    
    const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct'];
    const aujourdhui = new Date();
    
    return mois.map((mois, index) => {
      
      const progression = index / mois.length; 
      const nbMedicamentsActifs = Math.max(1, Math.round(medicaments.length * progression));
      
      
      const joursParMois = 30;
      let prisesAttenduesTotales = 0;
      
      medicaments.slice(0, nbMedicamentsActifs).forEach(med => {
        const frequence = parseInt(med.frequence) || 1;
        prisesAttenduesTotales += frequence * joursParMois;
      });
      
      
      const tauxBase = 0.75 + (progression * 0.15); // 75% à 90%
      const variation = ((index * 3) % 10 - 5) / 100;
      const tauxAdherence = Math.max(0.70, Math.min(0.95, tauxBase + variation));
      
      const prises = Math.round(prisesAttenduesTotales * tauxAdherence);
      const manques = prisesAttenduesTotales - prises;
      const adherence = prisesAttenduesTotales > 0 ? Math.round((prises / prisesAttenduesTotales) * 100) : 85;
      
      return { mois, adherence, prises, manques, total: prisesAttenduesTotales };
    });
  };

  
  const generateDonneesRepartition = () => {
    if (medicaments.length === 0) {
      return [
        { name: 'Prises réussies', value: 0, color: '#27ae60' },
        { name: 'Prises manquées', value: 0, color: '#e74c3c' },
        { name: 'Prises en retard', value: 0, color: '#f39c12' }
      ];
    }
    
  
    const joursAnalyse = 30;
    let totalDoses = 0;
    
    medicaments.forEach(med => {
      const dateDebut = new Date(med.dateDebut);
      const aujourdhui = new Date();
      const dateFin = med.dateFin ? new Date(med.dateFin) : null;
      
      
      let joursActifs = 0;
      for (let i = 0; i < joursAnalyse; i++) {
        const dateJour = new Date(aujourdhui);
        dateJour.setDate(aujourdhui.getDate() - i);
        
        if (dateJour >= dateDebut && (!dateFin || dateJour <= dateFin)) {
          joursActifs++;
        }
      }
      
      const frequence = parseInt(med.frequence) || 1;
      totalDoses += joursActifs * frequence;
    });
    
    
    const tauxReussi = medicaments.length === 1 ? 0.92 : 
                       medicaments.length === 2 ? 0.88 :
                       medicaments.length === 3 ? 0.85 : 0.82;
    
    const tauxRetard = 0.07;
    const tauxManque = 1 - tauxReussi - tauxRetard;
    
    const reussies = Math.round(totalDoses * tauxReussi);
    const retard = Math.round(totalDoses * tauxRetard);
    const manquees = totalDoses - reussies - retard;
    
    return [
      { name: 'Prises réussies', value: reussies, color: '#27ae60' },
      { name: 'Prises manquées', value: manquees, color: '#e74c3c' },
      { name: 'Prises en retard', value: retard, color: '#f39c12' }
    ];
  };

  
  const generateDonneesMedicaments = () => {
    if (medicaments.length === 0) return [];
    
    return medicaments.map((med, index) => {
      const dateDebut = new Date(med.dateDebut);
      const aujourdhui = new Date();
      const dateFin = med.dateFin ? new Date(med.dateFin) : null;
      
      
      let joursActifs = 0;
      for (let i = 0; i < 30; i++) {
        const dateJour = new Date(aujourdhui);
        dateJour.setDate(aujourdhui.getDate() - i);
        
        if (dateJour >= dateDebut && (!dateFin || dateJour <= dateFin)) {
          joursActifs++;
        }
      }
      
      const frequence = parseInt(med.frequence) || 1;
      const prisesParMois = joursActifs * frequence;
      
      
      const tauxBase = 0.85 + (index * 0.03); 
      const variation = ((med.nom.length % 10) - 5) / 100;
      const tauxAdherence = Math.max(0.75, Math.min(0.98, tauxBase + variation));
      
      const prises = Math.round(prisesParMois * tauxAdherence);
      const manques = prisesParMois - prises;
      const adherence = prisesParMois > 0 ? Math.round((prises / prisesParMois) * 100) : 100;
      
      return {
        medicament: med.nom,
        prises,
        manques,
        adherence
      };
    });
  };

  
  const generateDonneesHeures = () => {
    const heuresStandard = ['06h', '08h', '12h', '14h', '18h', '20h', '22h'];
    
    return heuresStandard.map(heure => {
      
      const nbMedsACetteHeure = medicaments.filter(med => {
        if (med.heure) {
          const heureInt = parseInt(heure);
          const medHeureInt = parseInt(med.heure.split(':')[0]);
          
          return Math.abs(heureInt - medHeureInt) <= 1;
        }
        return false;
      }).length;
      
      
      const basePrises = nbMedsACetteHeure > 0 ? 80 + (nbMedsACetteHeure * 20) : 10;
      const variation = (parseInt(heure) % 7) * 5; 
      const prises = basePrises + variation;
      
      return {
        heure,
        prises: Math.max(5, Math.min(150, prises))
      };
    });
  };

  // Données calculées dynamiquement
  const donneesAdherence = generateDonneesAdherence();
  const donneesTemporelles = generateDonneesTemporelles();
  const donneesRepartition = generateDonneesRepartition();
  const donneesMedicaments = generateDonneesMedicaments();
  const donneesHeures = generateDonneesHeures();

  // Données pour Chart.js(statistiques weeklyTrend)
  const chartJsAdherenceData = {
    labels: donneesAdherence.map(d => d.jour),
    datasets: [
      {
        label: 'Taux d\'adhérence (%)',
        data: donneesAdherence.map(d => d.adherence),
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        borderColor: 'rgba(52, 152, 219, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(158, 80, 127, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        borderColor: 'rgba(219, 52, 158, 1)'
      }
    ]
  };

  const chartJsBarData = {
    labels: donneesMedicaments.map(d => d.medicament),
    datasets: [
      {
        label: 'Prises réussies',
        data: donneesMedicaments.map(d => d.prises),
        backgroundColor: 'rgba(39, 174, 96, 0.8)',
        borderColor: 'rgba(39, 174, 96, 1)',
        borderWidth: 1
      },
      {
        label: 'Prises manquées',
        data: donneesMedicaments.map(d => d.manques),
        backgroundColor: 'rgba(231, 76, 60, 0.8)',
        borderColor: 'rgba(231, 76, 60, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartJsDoughnutData = {
    labels: donneesRepartition.map(d => d.name),
    datasets: [
      {
        data: donneesRepartition.map(d => d.value),
        backgroundColor: donneesRepartition.map(d => d.color),
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 10
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11,
            weight: '500'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          font: {
            size: 11,
            weight: '500'
          }
        }
      }
    }
  };

  // Statistiques générales calculées dynamiquement
  const calculateGlobalStats = () => {
    const repartition = donneesRepartition;
    const totalPrises = repartition.reduce((sum, item) => sum + item.value, 0);
    const prisesReussies = repartition.find(item => item.name === 'Prises réussies')?.value || 0;
    const prisesManquees = repartition.find(item => item.name === 'Prises manquées')?.value || 0;
    const prisesRetard = repartition.find(item => item.name === 'Prises en retard')?.value || 0;
    
    const adherenceGlobale = totalPrises > 0 ? Math.round((prisesReussies / totalPrises) * 100) : 0;
    
    // Calculer la tendance (comparer avec le mois précédent simulé)
    const adherenceMoisPrecedent = Math.max(70, adherenceGlobale - Math.floor(Math.random() * 8));
    const tendance = adherenceGlobale - adherenceMoisPrecedent;
    const tendanceStr = tendance > 0 ? `+${tendance}%` : `${tendance}%`;
    
    // Trouver le meilleur et pire jour
    const adherenceSemaine = donneesAdherence;
    const meilleurJour = adherenceSemaine.length > 0 
      ? adherenceSemaine.reduce((max, jour) => jour.adherence > max.adherence ? jour : max, adherenceSemaine[0]).jour
      : 'N/A';
    const pireJour = adherenceSemaine.length > 0
      ? adherenceSemaine.reduce((min, jour) => jour.adherence < min.adherence ? jour : min, adherenceSemaine[0]).jour
      : 'N/A';
    
    return {
      adherenceGlobale,
      totalPrises,
      prisesReussies,
      prisesManquees,
      prisesRetard,
      tendance: tendanceStr,
      meilleurJour,
      pireJour,
      heureOptimale: '08h00'
    };
  };

  const stats = calculateGlobalStats();

  const COLORS = ['#27ae60', '#e74c3c', '#a9731bff', '#3498db', '#9124bcff'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-value" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey.includes('adherence') ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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

      {/* Statistiques principales */}
      <div className="stats-overview">
        <div className="stat-card primary">
          <div className="stat-content">
            <div className="stat-number">{stats.adherenceGlobale}%</div>
            <div className="stat-label">{t('statistics.globalAdherence')}</div>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-content">
            <div className="stat-number">{stats.prisesReussies}</div>
            <div className="stat-label">{t('successful Doses')}</div>
          </div>
        </div>
        <div className="stat-card danger">
          <div className="stat-content">
            <div className="stat-number">{stats.prisesManquees}</div>
            <div className="stat-label">{t('missed Doses')}</div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-content">
            <div className="stat-number">{stats.prisesRetard}</div>
            <div className="stat-label">{t('delayed Doses')}</div>
          </div>
        </div>
      </div>

      {/* Graphiques principaux */}
      <div className="charts-grid">
        
        {/* Graphique d'adhérence quotidienne - Recharts */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>{t('Daily Adherence')}</h3>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={donneesAdherence}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="jour" stroke="#7f8c8d" fontSize={11} />
                <YAxis stroke="#7f8c8d" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="adherence"
                  stroke="#3498db"
                  fill="url(#colorAdherence)"
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="colorAdherence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3498db" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3498db" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique d'adhérence Chart.js */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>{t('weekly Trend')}</h3>
          </div>
          <div className="chart-content">
            <ChartLine data={chartJsAdherenceData} options={chartOptions} height={300} />
          </div>
        </div>

        {/* Graphique en secteurs - Recharts */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>{t('statistics.doseDistribution')}</h3>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={donneesRepartition}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donneesRepartition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique Doughnut Chart.js */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>{t('statistics.distribution')}</h3>
          </div>
          <div className="chart-content">
            <Doughnut 
              data={chartJsDoughnutData} 
              options={{
                ...chartOptions,
                cutout: '60%',
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'bottom'
                  }
                }
              }} 
              height={300} 
            />
          </div>
        </div>



        {/* Évolution temporelle - Recharts */}
        <div className="chart-container large">
          <div className="chart-header">
            <h3>{t('statistics.monthlyEvolution')}</h3>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donneesTemporelles}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" stroke="#7f8c8d" fontSize={11} />
                <YAxis stroke="#7f8c8d" fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="adherence" 
                  stroke="#3498db" 
                  strokeWidth={3}
                  dot={{ fill: '#3498db', strokeWidth: 2, r: 6 }}
                  name="Adhérence (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="prises" 
                  stroke="#27ae60" 
                  strokeWidth={2}
                  dot={{ fill: '#27ae60', strokeWidth: 2, r: 4 }}
                  name="Prises totales"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistiques;