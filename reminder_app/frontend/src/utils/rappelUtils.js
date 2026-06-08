
export const JOURS_OPTIONS = [
  { key: 'lun', label: 'Lundi' },
  { key: 'mar', label: 'Mardi' },
  { key: 'mer', label: 'Mercredi' },
  { key: 'jeu', label: 'Jeudi' },
  { key: 'ven', label: 'Vendredi' },
  { key: 'sam', label: 'Samedi' },
  { key: 'dim', label: 'Dimanche' }
];

export const FORM_INITIAL = {
  medicament: '',
  heures: [''],
  jours: [],
  son: true,
  vibration: true,
  actif: true
};

export const calculateNextReminder = (jours, heures) => {
  if (!heures || heures.length === 0) return null;

  const now = new Date();
  const next = new Date();
  const [hour, minute] = heures[0].split(':').map(Number);

  next.setHours(hour, minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);

  return next.toISOString();
};

export const transformMedicamentsToRappels = (medicaments) => {
  return medicaments.map(med => ({
    id: med.id || med._id,
    medicament: `${med.nom} ${med.dosage || ''}`.trim(),
    heures: med.heures_prise || ['08:00'],
    actif: true,
    jours: med.frequence === 'hebdomadaire'
      ? ['lun']
      : ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'],
    son: true,
    vibration: true,
    prochainRappel: calculateNextReminder(
      ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'],
      med.heures_prise || ['08:00']
    )
  }));
};

export const formatProchainRappel = (dateStr) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  const diffHours = Math.ceil((date - new Date()) / (1000 * 60 * 60));

  if (diffHours < 1) return 'Maintenant';
  if (diffHours < 24) return `Dans ${diffHours}h`;
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric',
    month: 'short', hour: '2-digit', minute: '2-digit'
  });
};

export const calculerStatsRappels = (rappels) => ({
  total: rappels.length,
  actifs: rappels.filter(r => r.actif).length,
  inactifs: rappels.filter(r => !r.actif).length,
  prochains24h: rappels.filter(r => {
    if (!r.actif || !r.prochainRappel) return false;
    const in24h = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return new Date(r.prochainRappel) <= in24h;
  }).length
});

export const validerFormRappel = (formData) => {
  if (!formData.medicament?.trim()) return 'Le médicament est obligatoire';
  if (!formData.heures?.some(h => h.trim())) return 'Au moins une heure est obligatoire';
  if (!formData.jours?.length) return 'Au moins un jour est obligatoire';
  return null;
};