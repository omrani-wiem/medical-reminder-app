export const preparerRappels = (medicaments) => {
  return medicaments.map((med, index) => ({
    id: index + 1,
    time: med.heure || '08:00',
    medication: `${med.nom || ''} ${med.dose || ''}`.trim(),
    type: med.forme || 'comprimé',
    taken: false,
    instructions: med.instructions || "À prendre avec un verre d'eau"
  }));
};