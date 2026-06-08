import api from './axiosInstance';

export const getSettings = async (email) => {
    const {data} = await api.get('/settings?email=${encodeURIComponent(email)}');
    return data;
};

export const saveSettings = async (formData) => {
    const {data} = await api.put('/settings', formData);
    return data;
};