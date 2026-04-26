import axiosInstance from '../axiosConfig'

export const menuApi = {
  getFoods: (params) => axiosInstance.get('/foods', { params }),
  getFood: (id) => axiosInstance.get(`/foods/${id}`),
  createFood: (data) => axiosInstance.post('/foods', data),
  updateFood: (id, data) => axiosInstance.put(`/foods/${id}`, data),
  deleteFood: (id) => axiosInstance.delete(`/foods/${id}`),
}
