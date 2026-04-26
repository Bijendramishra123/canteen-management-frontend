import axiosInstance from '../axiosConfig'

export const authApi = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  getProfile: () => axiosInstance.get('/auth/profile'),
  logout: () => axiosInstance.post('/auth/logout'),
}
