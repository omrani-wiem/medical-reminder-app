import api from './axiosInstance';

export const getRappels = async (email) => {
  const { data } = await api.get(`/rappels?email=${encodeURIComponent(email)}`);
  return data;
};

export const ajouterRappel = async (rappelData) => {
  const { data } = await api.post('/rappels', rappelData);
  return data;
};

export const modifierRappel = async (id, rappelData) => {
  const { data } = await api.put(`/rappels/${id}`, rappelData);
  return data;
};

export const supprimerRappel = async (id) => {
  const { data } = await api.delete(`/rappels/${id}`);
  return data;
};