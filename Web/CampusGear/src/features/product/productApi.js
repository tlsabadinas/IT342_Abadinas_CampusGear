import api from '../../shared/api/axiosInstance';

export const productApi = {
  getAll:       ()               => api.get('/items'),
  getById:      (id)             => api.get(`/items/${id}`),
  search:       (query)          => api.get(`/items/search?query=${encodeURIComponent(query)}`),
  getByCategory:(category)       => api.get(`/items/category/${encodeURIComponent(category)}`),
  getMyListings:()               => api.get('/items/my'),
  create:       (data)           => api.post('/items', data),
  update:       (id, data)       => api.put(`/items/${id}`, data),
  delete:       (id)             => api.delete(`/items/${id}`),
};
