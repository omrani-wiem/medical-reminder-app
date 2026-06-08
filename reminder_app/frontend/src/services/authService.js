import api from './axiosInstance';

export const forgotPassword = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const login = async (formData) => {
  const { data } = await api.post('/auth/login', formData);
  return data;
};

export const register = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};


export const resetPassword = async (email, code, new_password) => {
  const { data } = await api.post('/auth/reset-password', { email, code, new_password });
  return data;
};