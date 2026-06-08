import api from './axiosInstance';

export const ajouterMedicament = async (medicamentData) => {
    const {data }  = await api.post('/medicaments', medicamentData);
    return data;
};



export const getMedicaments = async (email) => {
    const { data } = await api.get(`/medicaments?email=${encodeURIComponent(email)}`);
    return data;
};


export const getMedicamentsByEmail = async (email) => {
    const { data } = await api.get(`/medicaments?email=${encodeURIComponent(email)}`);
    return data;
};

export const ajouterMedicament = async (medicamentData) => {
  const { data } = await api.post('/medicaments', medicamentData);
  return data;
};

export const modifierMedicament = async (id, medicamentData) => {
  const { data } = await api.put(`/medicaments/${id}`, medicamentData);
  return data;
};

export const supprimerMedicament = async (id) => {
  const { data } = await api.delete(`/medicaments/${id}`);
  return data;
};