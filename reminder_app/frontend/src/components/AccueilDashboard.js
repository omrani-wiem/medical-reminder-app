import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './AccueilDashboard.css';

// Fonction pour calculer les statistiques d'adhérence cette semaine
const calculerStatistiquesAdherence = (medicaments) => {
  if (!medicaments || medicaments.length === 0) {
    return {
      adherence: 0,
      medicamentsPris: 0,
      medicamentsManques: 0,
      stock: { enStock: 0, bientotEpuise: 0, epuise: 0 },
    };
  }

  // calculer le nombre de jours depuis le début de la semaine
  const aujourdhui = new Date();
  const jourSemaine = aujourdhui.getDay();
  const joursDepuisLundi = jourSemaine === 0 ? 6 : jourSemaine - 1;
  const joursEcoules = joursDepuisLundi + 1;

  // calculer le nombre total de prises attendues chaque jour
  let prisesAttenduesTotales = 0;

  medicaments.forEach((med) => {
    const frequence = parseInt(med.frequence) || 1;
    const prisesParJour = frequence;

    // pour chaque médicament, calculer les prises attendues depuis le début de la semaine
    const dateDebut = new Date(med.dateDebut);
    const dateFin = med.dateFin ? new Date(med.dateFin) : null;

    // calculer combien de jours ce médicament devrait être pris cette semaine
    let joursActifs = 0;
    for (let i = 0; i < joursEcoules; i++) {
      const dateJour = new Date(aujourdhui);
      dateJour.setDate(aujourdhui.getDate() - joursDepuisLundi + i);

      // vérifier si ce jour est dans la période du médicament
      if (dateJour >= dateDebut && (!dateFin || dateJour <= dateFin)) {
        joursActifs++;
      }
    }

    prisesAttenduesTotales += joursActifs * prisesParJour;
  });
// Simulation réaliste de l'adhérence basée sur les médicaments
  // Plus on a de médicaments, plus il est difficile d'avoir 100% d'adhérence
  const tauxAdherenceBase = medicaments.length === 1 ? 0.95 : 
                            medicaments.length === 2 ? 0.90 :
                            medicaments.length === 3 ? 0.87 :
                            medicaments.length >= 4 ? 0.85 : 0.90;
  
// Ajouter un peu de variation aléatoire (±5%) mais prévisible
  const seed = medicaments.reduce((acc, med) => acc + (med.nom ? med.nom.length : 0), 0);
  const variation = ((seed % 10) - 5) / 100; // Entre -0.05 et +0.04
  const tauxAdherence = Math.max(0.7, Math.min(1.0, tauxAdherenceBase + variation));

// calculer les prises effectuées et manquées
const prisesPrises = Math.round(prisesAttenduesTotales * tauxAdherence);
  const prisesManquees = prisesAttenduesTotales - prisesPrises;
  const adherencePourcentage = prisesAttenduesTotales > 0 
    ? Math.round((prisesPrises / prisesAttenduesTotales) * 100)
    : 0;

//calculer les statistiques de stock
// Calculer les statistiques de stock
  const stock = {
    enStock: medicaments.filter(m => (m.stock || 0) > (m.stockMin || 10)).length,
    bientotEpuise: medicaments.filter(m => {
      const stock = m.stock || 0;
      const stockMin = m.stockMin || 10;
      return stock > 0 && stock <= stockMin;
    }).length,
    epuise: medicaments.filter(m => (m.stock || 0) === 0).length
  };

  return {
    adherence: adherencePourcentage,
    medicamentsPris: prisesPrises,
    medicamentsManques: prisesManquees,
    stock
  };
};

const AcceuilDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);


// Récupérer les médicaments depuis le backend
useEffect(() => {
  fetchMedicaments();
}, []);

const fetchMedicaments = async () => {
  try {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.email) {
      console.error('utilisateur non connecté');
      setLoading(false);
      return;
    }

    const response = await fetch(`http://localhost:5000/medicaments?email=${encodeURIComponent(user.email)}`);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des médicaments');
    }

    const data = await response.json();
    setMedicaments(data || []);

    // Préparer les rappels d'aujourd'hui
    const rappels = (data || []).map((med, index) => ({
      id: index + 1,
      time: med.heure || '08:00',
      medication: `${med.nom || ''} ${med.dose || ''}`.trim(), 
      type: med.forme || 'comprimé',
      taken: false,
      instructions: med.instructions || "A prendre avec un verre d'eau"
    }));
    setProchainRappels(rappels);

   // Calculer les statistiques d'adhérence dynamiquement
      const stats = calculerStatistiquesAdherence(data);
      setStatistiques(stats);

    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const prochainRendezVous = {
    medecin: 'Dr. Martin',
    date: '15 octobre 2025',
    heure: '14:30',
    type: 'Consultation de suivi'
  };

 const marquerCommePris = (rappelId) => {
  //fonction pour parquer un rappel comme pris
  console.log(`Rppel ${rappelId} marqué comme pris`);
 };
 

  return (
    <div className="acceuil-dashboard">
            <div className="dashboard-grid">
              <div className="dashboard-card large-card">
                 <div className="card-header">
                   <h3> {t('dashboard.upcomingReminders')}</h3>
                   <span className="card-badge">{prochainRappels.length} {t('dashboard.reminderscount')}</span>
                 </div>
              </div>
            </div>
    </div>
    
      
  );
};

export default AcceuilDashboard;