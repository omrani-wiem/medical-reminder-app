const addMinutes  = (timeStr, minutes) => {
    const [hours, mins] = timeStr.split(':').map(Number); //tableau.map(fonction)
    const totalMinutes = hours * 60 + mins + mintes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
   return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};

export const calculerRetard = (heurePrevu, heurePrise)  => {
    if (!heurePrevu || !heuresPrise) return null;

    const toMinutes = (t) =>  {

        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
 };
 return toMinutes(heurePrise) - toMinutes(heurePrevu);
};



export const formatHistorique = (prises) => {
  return prises.map(prise => {
    const retard = prise.statut === 'pris'
      ? calculerRetard(prise.heurePrevu, prise.heurePrise)
      : null;

    return {
         id: prise.id,
      medicament: `${prise.medicamentNom} ${prise.dosage || ''}`.trim(),
      date: prise.datePrevu,
      heure: prise.heurePrevu,
      statut: prise.statut,           
      dosage: prise.dosage || '-',
      forme: prise.forme || '-',
      priseEffective: prise.heurePrise || null,
      retard,
      medecin: prise.medecin || '-',
      notes: prise.statut === 'pris'
        ? (retard > 10 ? 'Léger retard' : retard < -5 ? 'En avance' : "À l'heure")
        : prise.statut === 'manque' ? 'Oublié' : 'En attente'
    };
  });
};


export const filtrerHistorique = (historique, filtres) => {  let result = [...historique];

  if (filtres.recherche) {
    const q = filtres.recherche.toLowerCase();
    result = result.filter(item =>
      item.medicament.toLowerCase().includes(q) ||
      item.medecin.toLowerCase().includes(q) ||
      item.notes?.toLowerCase().includes(q)
    );
  }

  if (filtres.statut && filtres.statut !== 'tous') {
    result = result.filter(item => item.statut === filtres.statut);
  }

  if (filtres.periode && filtres.periode !== 'tous') {
    const jours = { '7j': 7, '30j': 30, '90j': 90 }[filtres.periode];
    if (jours) {
      const dateLimit = new Date(Date.now() - jours * 24 * 60 * 60 * 1000);
      result = result.filter(item => new Date(item.date) >= dateLimit);
    }
  }

  if (filtres.dateDebut) {
    result = result.filter(item => new Date(item.date) >= new Date(filtres.dateDebut));
  }

  if (filtres.dateFin) {
    result = result.filter(item => new Date(item.date) <= new Date(filtres.dateFin));
  }

  return result.sort((a, b) =>
    new Date(`${b.date} ${b.heure}`) - new Date(`${a.date} ${a.heure}`)
  );
};

export const calculerStatistiques = (donnees) => {
  const total = donnees.length;
  const pris = donnees.filter(i => i.statut === 'pris').length;
  const manques = donnees.filter(i => i.statut === 'manque').length;
  const adherence = total > 0 ? Math.round((pris / total) * 100) : 0;

  
  const prisesAvecRetard = donnees.filter(i => i.statut === 'pris' && i.retard !== null);
  const retardMoyen = prisesAvecRetard.length > 0
    ? Math.round(prisesAvecRetard.reduce((acc, i) => acc + i.retard, 0) / prisesAvecRetard.length)
    : 0;

  return { total, pris, manques, adherence, retardMoyen };
};

export const filtrerHistorique = (historique, filtres) => {
  let result = [...historique];

  if (filtres.recherche) {
    const q = filtres.recherche.toLowerCase();
    result = result.filter(item =>
      
      item.medicament?.toLowerCase().includes(q) ||
      item.medecin?.toLowerCase().includes(q) ||
      item.notes?.toLowerCase().includes(q)
    );
  }

  if (filtres.statut && filtres.statut !== 'tous') {
    result = result.filter(item => item.statut === filtres.statut);
  }

  if (filtres.periode && filtres.periode !== 'tous') {
    const jours = { '7j': 7, '30j': 30, '90j': 90 }[filtres.periode];
    if (jours) {
      const dateLimit = new Date(Date.now() - jours * 24 * 60 * 60 * 1000);
     
      result = result.filter(item => new Date(item.date + 'T00:00:00') >= dateLimit);
    }
  }

  if (filtres.dateDebut) {
    result = result.filter(item =>
      new Date(item.date + 'T00:00:00') >= new Date(filtres.dateDebut + 'T00:00:00')
    );
  }

  if (filtres.dateFin) {
    result = result.filter(item =>
      new Date(item.date + 'T00:00:00') <= new Date(filtres.dateFin + 'T00:00:00')
    );
  }

  return result.sort((a, b) =>
    new Date(`${b.date}T${b.heure}`) - new Date(`${a.date}T${a.heure}`)
  );
};

export const exporterCSV = (donnees) => {
  const headers = ['Date', 'Heure', 'Médicament', 'Dosage', 'Statut', 'Prise Effective', 'Retard', 'Médecin', 'Notes'];

 
  const escapeCSV = (val) => {
    const str = String(val ?? '-');
    return str.includes(',') ? `"${str}"` : str;
  };

  const csvContent = [
    headers.join(','),
    ...donnees.map(item => [
      item.date,
      item.heure,
      item.medicament,
      item.dosage,
      item.statut,
      item.priseEffective || '-',
      item.retard != null ? `${item.retard}min` : '-',
      item.medecin,
      item.notes || '-'
    ].map(escapeCSV).join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `historique-medicaments-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};