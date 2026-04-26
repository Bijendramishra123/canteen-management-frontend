import { createSlice } from '@reduxjs/toolkit'

// Safe localStorage getter
const getLocalStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    if (item === 'undefined' || item === 'null' || !item) {
      return defaultValue
    }
    return JSON.parse(item)
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error)
    localStorage.removeItem(key)
    return defaultValue
  }
}

const initialState = {
  user: getLocalStorageItem('user', null),
  isAuthenticated: !!localStorage.getItem('access_token') && localStorage.getItem('access_token') !== 'undefined',
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      console.log('Setting credentials in slice:', { user, token })
      state.user = user
      state.isAuthenticated = true
      state.loading = false
      state.error = null
      try {
        localStorage.setItem('access_token', token)
        localStorage.setItem('user', JSON.stringify(user))
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      try {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
      } catch (error) {
        console.error('Error removing from localStorage:', error)
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const { setCredentials, logout, setLoading, setError } = authSlice.actions
export default authSlice.reducer
