import axios from 'axios'
import toast from 'react-hot-toast'

// Use environment variable, but fallback to production URL
const API_URL = import.meta.env.VITE_API_URL || 'https://canteen-management-backend-vj7n.onrender.com/api'

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Increase timeout for free tier backend
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Backend might be waking up (free tier). Please wait and try again.')
    } else if (error.response?.data?.detail) {
      toast.error(error.response.data.detail)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance