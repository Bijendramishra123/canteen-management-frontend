import axiosInstance from '../axiosConfig'

export const ordersApi = {
  getOrders: () => axiosInstance.get('/orders'),
  getOrder: (id) => axiosInstance.get(`/orders/${id}`),
  createOrder: (data) => axiosInstance.post('/orders', data),
  // Ensure the URL path is correct and id is properly interpolated
  updateOrderStatus: (id, status) => axiosInstance.patch(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => axiosInstance.post(`/orders/${id}/cancel`),
}
