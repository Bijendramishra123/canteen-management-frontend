import axios from 'axios'
import toast from 'react-hot-toast'

// Direct production URL - no environment variable dependency
const API_URL = 'https://canteen-management-backend-vj7n.onrender.com/api'

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, token ? '(with token)' : '(no token)')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('[API Error]', error.response?.status, error.response?.data)
    if (error.code === 'ERR_NETWORK') {
      toast.error('Network error. Backend might be waking up (free tier). Please wait and try again.')
    } else if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
        toast.error('Session expired. Please login again.')
      }
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action')
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.response?.data?.detail) {
      toast.error(error.response.data.detail)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
