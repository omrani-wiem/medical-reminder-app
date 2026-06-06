import api from './axiosInstance';

export const ajouterMedicament = async (medicamentData) => {
    const {data }  = await api.post('/medicaments', medicamentData);
    return data;
};