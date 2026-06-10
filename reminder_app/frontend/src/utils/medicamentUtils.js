export const FORMES_MEDICAMENT = [
  'Comprimé', 'Gélule', 'Sirop', 'Injection', 'Pommade', 'Gouttes'
];

export const FREQUENCES_MEDICAMENT = [
  { value: '1x/jour', label: '1 fois par jour' },
  { value: '2x/jour', label: '2 fois par jour' },
  { value: '3x/jour', label: '3 fois par jour' },
  { value: '4x/jour', label: '4 fois par jour' },
  { value: 'si-besoin', label: 'Si besoin' },
];


export const marquerPrise = async (priseId, heuresPrise) => {
   const { data } = await api.patch(`/prises/${priseId}`, {
    statut: 'pris',
    heurePrise
  });
  return data;
};

export const FORM_INITIAL = {
  nom: '', dosage: '', forme: 'Comprimé', couleur: '',
  frequence: '1x/jour',  // ← valeur par défaut
  duree: '', stock: '', stockMin: '',
  medecin: '', dateDebut: '', dateFin: '', instructions: ''
};

export const getStockStatus = (stock, stockMin) => {
  if (stock === 0) return 'epuise';
  if (stock <= stockMin) return 'faible';
  return 'normal';
};

export const getStockColor = (status) => {
  const colors = { epuise: '#e74c3c', faible: '#f39c12', normal: '#27ae60' };
  return colors[status] || colors.normal;
};

export const filtrerMedicaments = (medicaments, searchTerm, filterType) => {
  return medicaments.filter(med => {
    const matchSearch =
      med.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.medecin?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchFilter =
      filterType === 'tous' ||
      (filterType === 'faible-stock' && med.stock <= med.stockMin && med.stock > 0) ||
      (filterType === 'epuise' && med.stock === 0);

    return matchSearch && matchFilter;
  });
};