import api from '../../shared/api/axiosInstance';

export const orderApi = {
  create:      (data) => api.post('/orders', data),
  getMyRentals:()     => api.get('/orders/my-rentals'),
  getMyLendings:()    => api.get('/orders/my-lendings'),
  getById:     (id)   => api.get(`/orders/${id}`),
  cancel:      (id)   => api.put(`/orders/${id}/cancel`),
};
