import api from './axiosInstance';

export const getStatistiques = async (email, periode) => {
  const { data } = await api.get('/statistiques', {
    params: { email, periode }
  });
  return data;
};