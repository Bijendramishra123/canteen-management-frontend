import { useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../api/endpoints/auth'
import { setCredentials, logout as logoutAction, setError } from '../redux/slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await authApi.login(credentials)
      console.log('Login response:', response.data)
      return response.data
    },
    onSuccess: (data) => {
      console.log('Login user data:', data.user)
      dispatch(setCredentials({ user: data.user, token: data.access_token }))
      toast.success('Login successful!')
      if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    },
    onError: (error) => {
      console.error('Login error:', error)
      toast.error(error.response?.data?.detail || 'Login failed')
      dispatch(setError(error.response?.data?.detail))
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await authApi.register(userData)
      console.log('Register response:', response.data)
      return response.data
    },
    onSuccess: (data) => {
      // FIX: Auto-login after successful registration
      console.log('Registration successful, auto-login with token:', data)
      
      if (data.access_token && data.user) {
        // Auto-login by dispatching credentials
        dispatch(setCredentials({ user: data.user, token: data.access_token }))
        toast.success('Registration successful! Welcome!')
        
        if (data.user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        // Fallback: just show success and ask to login
        toast.success('Registration successful! Please login.')
        navigate('/login')
      }
    },
    onError: (error) => {
      console.error('Register error:', error)
      const errorMsg = error.response?.data?.detail || 'Registration failed'
      toast.error(errorMsg)
      dispatch(setError(errorMsg))
    },
  })

  const logout = () => {
    dispatch(logoutAction())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  }
}
