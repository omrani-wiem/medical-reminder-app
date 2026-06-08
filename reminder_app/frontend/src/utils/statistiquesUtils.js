// utils/statistiquesUtils.js

export const COLORS = ['#27ae60', '#e74c3c', '#f39c12', '#3498db', '#9124bc'];

// ─── Génération des données ───────────────────────────────────────────────────

export const generateDonneesAdherence = (medicaments) => {
  if (!medicaments.length) return [];

  const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const aujourdhui = new Date();
  const joursDepuisLundi = aujourdhui.getDay() === 0 ? 6 : aujourdhui.getDay() - 1;

  return jours.map((jour, index) => {
    const dateJour = new Date(aujourdhui);
    dateJour.setDate(aujourdhui.getDate() - joursDepuisLundi + index);

    let prisesAttenduesTotales = 0;
    medicaments.forEach(med => {
      const dateDebut = new Date(med.dateDebut);
      const dateFin = med.dateFin ? new Date(med.dateFin) : null;
      if (dateJour >= dateDebut && (!dateFin || dateJour <= dateFin)) {
        prisesAttenduesTotales += parseInt(med.frequence) || 1;
      }
    });

    const tauxBase = [0.95, 0.92, 0.88, 0.85][Math.min(medicaments.length - 1, 3)];
    const variation = ((index * 7) % 10 - 5) / 100;
    const taux = Math.max(0.75, Math.min(1.0, tauxBase + variation));

    const prises = Math.round(prisesAttenduesTotales * taux);
    const manques = prisesAttenduesTotales - prises;
    const adherence = prisesAttenduesTotales > 0
      ? Math.round((prises / prisesAttenduesTotales) * 100) : 100;

    return { jour, adherence, prises, manques, total: prisesAttenduesTotales };
  });
};

export const generateDonneesTemporelles = (medicaments) => {
  if (!medicaments.length) return [];

  const moisLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct'];

  return moisLabels.map((mois, index) => {
    const progression = index / moisLabels.length;
    const nbActifs = Math.max(1, Math.round(medicaments.length * progression));
    let prisesAttenduesTotales = 0;

    medicaments.slice(0, nbActifs).forEach(med => {
      prisesAttenduesTotales += (parseInt(med.frequence) || 1) * 30;
    });

    const taux = Math.max(0.70, Math.min(0.95,
      0.75 + progression * 0.15 + ((index * 3) % 10 - 5) / 100
    ));

    const prises = Math.round(prisesAttenduesTotales * taux);
    const adherence = prisesAttenduesTotales > 0
      ? Math.round((prises / prisesAttenduesTotales) * 100) : 85;

    return { mois, adherence, prises, manques: prisesAttenduesTotales - prises, total: prisesAttenduesTotales };
  });
};

export const generateDonneesRepartition = (medicaments) => {
  if (!medicaments.length) return [
    { name: 'Prises réussies', value: 0, color: '#27ae60' },
    { name: 'Prises manquées', value: 0, color: '#e74c3c' },
    { name: 'Prises en retard', value: 0, color: '#f39c12' }
  ];

  const aujourdhui = new Date();
  let totalDoses = 0;

  medicaments.forEach(med => {
    const dateDebut = new Date(med.dateDebut);
    const dateFin = med.dateFin ? new Date(med.dateFin) : null;
    let joursActifs = 0;

    for (let i = 0; i < 30; i++) {
      const d = new Date(aujourdhui);
      d.setDate(aujourdhui.getDate() - i);
      if (d >= dateDebut && (!dateFin || d <= dateFin)) joursActifs++;
    }
    totalDoses += joursActifs * (parseInt(med.frequence) || 1);
  });

  const tauxReussi = [0.92, 0.88, 0.85, 0.82][Math.min(medicaments.length - 1, 3)];
  const tauxRetard = 0.07;
  const reussies = Math.round(totalDoses * tauxReussi);
  const retard = Math.round(totalDoses * tauxRetard);

  return [
    { name: 'Prises réussies', value: reussies, color: '#27ae60' },
    { name: 'Prises manquées', value: totalDoses - reussies - retard, color: '#e74c3c' },
    { name: 'Prises en retard', value: retard, color: '#f39c12' }
  ];
};

export const generateDonneesMedicaments = (medicaments) => {
  if (!medicaments.length) return [];
  const aujourdhui = new Date();

  return medicaments.map((med, index) => {
    const dateDebut = new Date(med.dateDebut);
    const dateFin = med.dateFin ? new Date(med.dateFin) : null;
    let joursActifs = 0;

    for (let i = 0; i < 30; i++) {
      const d = new Date(aujourdhui);
      d.setDate(aujourdhui.getDate() - i);
      if (d >= dateDebut && (!dateFin || d <= dateFin)) joursActifs++;
    }

    const prisesParMois = joursActifs * (parseInt(med.frequence) || 1);
    const taux = Math.max(0.75, Math.min(0.98,
      0.85 + index * 0.03 + ((med.nom.length % 10) - 5) / 100
    ));
    const prises = Math.round(prisesParMois * taux);

    return {
      medicament: med.nom,
      prises,
      manques: prisesParMois - prises,
      adherence: prisesParMois > 0 ? Math.round((prises / prisesParMois) * 100) : 100
    };
  });
};

export const generateDonneesHeures = (medicaments) => {
  const heures = ['06h', '08h', '12h', '14h', '18h', '20h', '22h'];

  return heures.map(heure => {
    const nb = medicaments.filter(med => {
      if (!med.heure) return false;
      return Math.abs(parseInt(heure) - parseInt(med.heure.split(':')[0])) <= 1;
    }).length;

    const prises = Math.max(5, Math.min(150,
      (nb > 0 ? 80 + nb * 20 : 10) + parseInt(heure) % 7 * 5
    ));
    return { heure, prises };
  });
};

// ─── Stats globales ───────────────────────────────────────────────────────────

export const calculateGlobalStats = (donneesRepartition, donneesAdherence) => {
  const total = donneesRepartition.reduce((s, i) => s + i.value, 0);
  const reussies = donneesRepartition.find(i => i.name === 'Prises réussies')?.value || 0;
  const manquees = donneesRepartition.find(i => i.name === 'Prises manquées')?.value || 0;
  const retard   = donneesRepartition.find(i => i.name ===