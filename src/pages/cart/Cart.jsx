import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiUser, FiPhone, FiMail, FiUsers, FiDollarSign, FiMessageCircle } from 'react-icons/fi'
import { removeFromCart, updateQuantity, clearCart } from '../../redux/slices/cartSlice'
import { useCreateOrder } from '../../hooks/queries/useOrders'
import toast from 'react-hot-toast'

const Cart = () => {
  const { items, totalAmount, totalItems } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const createOrderMutation = useCreateOrder()
  
  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    customer_phone: '',
    customer_email: user?.email || '',
    tip_amount: 0,
    number_of_people: 1,
    special_instructions: ''
  })
  
  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) return
    dispatch(updateQuantity({ id, quantity }))
  }
  
  const handlePlaceOrder = () => {
    if (!formData.customer_phone) {
      toast.error('Please enter your phone number')
      return
    }
    if (!formData.customer_name) {
      toast.error('Please enter your name')
      return
    }
    
    const orderData = {
      items: items.map(item => ({
        food_id: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      })),
      total_amount: totalAmount + (formData.tip_amount || 0) + 40,
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      customer_email: formData.customer_email,
      tip_amount: formData.tip_amount || 0,
      number_of_people: formData.number_of_people,
      special_instructions: formData.special_instructions || ''
    }
    
    createOrderMutation.mutate(orderData, {
      onSuccess: () => {
        dispatch(clearCart())
        toast.success('Order placed successfully!')
        navigate('/orders')
      }
    })
  }
  
  if (items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
        <FiShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/menu')} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all">
          Browse Menu
        </button>
      </motion.div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Shopping Cart ({totalItems} items)
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-all"
              >
                <img src={item.image_url || 'https://placehold.co/80'} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-blue-600 font-bold">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <FiMinus />
                  </button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                    <FiPlus />
                  </button>
                  <button onClick={() => dispatch(removeFromCart(item.id))} className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <FiTrash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FiUser className="text-blue-500" /> Customer Details
            </h2>
            <div className="space-y-3">
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Full Name *" value={formData.customer_name} onChange={(e) => setFormData({...formData, customer_name: e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="tel" placeholder="Phone Number *" value={formData.customer_phone} onChange={(e) => setFormData({...formData, customer_phone: e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="email" placeholder="Email" value={formData.customer_email} onChange={(e) => setFormData({...formData, customer_email: e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="relative">
                <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="number" placeholder="Number of People" value={formData.number_of_people} onChange={(e) => setFormData({...formData, number_of_people: parseInt(e.target.value) || 1})} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" min="1" />
              </div>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="number" placeholder="Tip Amount (₹)" value={formData.tip_amount} onChange={(e) => setFormData({...formData, tip_amount: parseInt(e.target.value) || 0})} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" min="0" />
              </div>
              <div className="relative">
                <FiMessageCircle className="absolute left-3 top-3 text-gray-400" />
                <textarea placeholder="Special Instructions (optional)" value={formData.special_instructions} onChange={(e) => setFormData({...formData, special_instructions: e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows="2" />
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 border-b pb-4">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{totalAmount}</span></div>
              <div className="flex justify-between"><span>Delivery Fee</span><span>₹{totalAmount > 0 ? 40 : 0}</span></div>
              {formData.tip_amount > 0 && <div className="flex justify-between"><span>Tip</span><span>₹{formData.tip_amount}</span></div>}
              <div className="flex justify-between"><span>People</span><span>{formData.number_of_people}</span></div>
            </div>
            <div className="flex justify-between mt-4 font-bold text-lg">
              <span>Total</span>
              <span className="text-blue-600">₹{totalAmount + (totalAmount > 0 ? 40 : 0) + (formData.tip_amount || 0)}</span>
            </div>
            <button onClick={handlePlaceOrder} disabled={createOrderMutation.isPending} className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50">
              {createOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cart
