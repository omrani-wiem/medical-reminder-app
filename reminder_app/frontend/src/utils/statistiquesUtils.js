// utils/statistiquesUtils.js
// Plus aucune simulation — seulement la config et les builders

export const buildChartJsAdherenceData = (donneesAdherence) => ({
  labels: donneesAdherence.map(d => d.jour),
  datasets: [{
    label: "Taux d'adhérence (%)",
    data: donneesAdherence.map(d => d.adherence),
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    borderColor: 'rgba(219, 52, 158, 1)',
    borderWidth: 3, fill: true, tension: 0.4,
    pointBackgroundColor: 'rgba(158, 80, 127, 1)',
    pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 6
  }]
});

export const buildChartJsBarData = (donneesMedicaments) => ({
  labels: donneesMedicaments.map(d => d.medicament),
  datasets: [
    {
      label: 'Prises réussies',
      data: donneesMedicaments.map(d => d.prises),
      backgroundColor: 'rgba(39, 174, 96, 0.8)',
      borderColor: 'rgba(39, 174, 96, 1)', borderWidth: 1
    },
    {
      label: 'Prises manquées',
      data: donneesMedicaments.map(d => d.manques),
      backgroundColor: 'rgba(231, 76, 60, 0.8)',
      borderColor: 'rgba(231, 76, 60, 1)', borderWidth: 1
    }
  ]
});

export const buildChartJsDoughnutData = (donneesRepartition) => ({
  labels: donneesRepartition.map(d => d.name),
  datasets: [{
    data: donneesRepartition.map(d => d.value),
    backgroundColor: donneesRepartition.map(d => d.color),
    borderColor: '#fff', borderWidth: 3, hoverOffset: 10
  }]
});

export const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: { padding: 20, font: { size: 12, weight: '600' } }
    },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleColor: '#fff', bodyColor: '#fff',
      borderColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1, cornerRadius: 8, padding: 12
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11, weight: '500' } } },
    y: { grid: { color: 'rgba(0,0,0,0.1)' }, ticks: { font: { size: 11, weight: '500' } } }
  }
};