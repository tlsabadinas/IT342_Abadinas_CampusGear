import api from '../../shared/api/axiosInstance';

export const userApi = {
  getProfile:    ()     => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};
