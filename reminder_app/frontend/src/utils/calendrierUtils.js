const COLORS = ['#3498db', '#27ae60', '#f39c12', '#9b59b6', '#e74c3c'];

export const getRandomColor = () =>
    COLORS[[Math.floor(Math.random() * COLORS.length)]];

export const generateScheduleFormMedicaments = (medicaments) =>  {
    const schedule = {};
    let idCounter =1;


    for (let i = 0; i< 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        

        medicaments.forEach(med => {
            const heures = med.heures_prise || ['08:00'];
            heures.forEach(heure => {
                schedule.push({
                     id: idCounter++,
                     medicament: `${med.nom} ${med.dosage || ''}`.trim(),
                     heure,
                     date: dateStr,
                     pris: false,
                     couleur: getRandomColor()

                });
            });
        });

    }

    return schedule;
};


export const getDaysInMonth = (currentDate) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startCalendar = new Date(firstDay);
  startCalendar.setDate(startCalendar.getDate() - firstDay.getDay());

    const days = [];
  const endCalendar = new Date(startCalendar);
  endCalendar.setDate(endCalendar.getDate() + 42);

  const current = new Date(startCalendar);
  while (current < endCalendar) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
};

export const getWeekDays = (currentDate) => {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });
};


export const getMedicationsForDate = (schedule, date) => {
  const dateStr = date.toISOString().split('T')[0];
  return schedule.filter(med => med.date === dateStr);
};

export const formatDate = (date) =>
  date.toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric',
    month: 'long', day: 'numeric'
  });

export const isToday = (date) =>
  date.toDateString() === new Date().toDateString();

export const isCurrentMonth = (date, currentDate) =>
  date.getMonth() === currentDate.getMonth();


