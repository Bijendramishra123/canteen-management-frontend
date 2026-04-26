import { createSlice } from '@reduxjs/toolkit'

// Safe localStorage getter
const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem('cart')
    if (cart === 'undefined' || cart === 'null' || !cart) {
      return []
    }
    return JSON.parse(cart)
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error)
    localStorage.removeItem('cart')
    return []
  }
}

const initialState = {
  items: getCartFromStorage(),
  totalAmount: 0,
  totalItems: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      try {
        localStorage.setItem('cart', JSON.stringify(state.items))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      try {
        localStorage.setItem('cart', JSON.stringify(state.items))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      if (item && quantity > 0) {
        item.quantity = quantity
      } else if (quantity === 0) {
        state.items = state.items.filter(item => item.id !== id)
      }
      
      state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      try {
        localStorage.setItem('cart', JSON.stringify(state.items))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.totalAmount = 0
      state.totalItems = 0
      try {
        localStorage.removeItem('cart')
      } catch (error) {
        console.error('Error removing cart from localStorage:', error)
      }
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
