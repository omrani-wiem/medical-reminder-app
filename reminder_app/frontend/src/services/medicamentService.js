
import api from './axiosInstance';

export const getMedicaments = async (email) => {
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

export const getHistoriquePrises = async (email) => {
  const { data } = await api.get(`/prises?email=${encodeURIComponent(email)}`);
  return data;
};

export const marquerPrise = async (priseId, heurePrise) => {
  const { data } = await api.patch(`/prises/${priseId}`, { heurePrise });
  return data;
};


