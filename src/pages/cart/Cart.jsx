import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiUser, FiPhone, 
  FiMail, FiUsers, FiDollarSign, FiMessageCircle, FiCoffee, 
  FiCheckCircle, FiGift, FiTag, FiLoader 
} from 'react-icons/fi'
import { removeFromCart, updateQuantity, clearCart } from '../../redux/slices/cartSlice'
import { useCreateOrder } from '../../hooks/queries/useOrders'
import BirthdayRequest from '../../components/ui/BirthdayRequest'
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
  
  const [showTipOptions, setShowTipOptions] = useState(false)
  const [showBirthdayRequest, setShowBirthdayRequest] = useState(false)
  const [birthdayOffer, setBirthdayOffer] = useState(null)
  const [pendingRequest, setPendingRequest] = useState(null)
  const [isChecking, setIsChecking] = useState(true)
  
  const tipOptions = [0, 20, 50, 100, 200]
  
  // Check for birthday offer and pending request
  const checkBirthdayStatus = () => {
    setIsChecking(true)
    
    // Check approved users from localStorage (persists after logout)
    const approvedUsers = JSON.parse(localStorage.getItem('approved_birthday_users') || '[]')
    const userApproved = approvedUsers.find(u => u.user_id === user?.id)
    
    if (userApproved) {
      const today = new Date()
      const birthDate = new Date(userApproved.birth_date)
      const isBirthdayToday = birthDate.getDate() === today.getDate() && birthDate.getMonth() === today.getMonth()
      const isOfferValid = userApproved.approved_date && new Date(userApproved.approved_date) <= today
      
      if (isBirthdayToday && isOfferValid) {
        setBirthdayOffer({
          active: true,
          discount: 50,
          message: 'Happy Birthday! 50% discount applied!',
          approved_date: userApproved.approved_date
        })
        setPendingRequest(null)
      } else {
        setBirthdayOffer(null)
      }
    } else {
      setBirthdayOffer(null)
    }
    
    // Check pending requests
    const requests = JSON.parse(localStorage.getItem('birthday_requests') || '[]')
    const userPending = requests.find(r => r.user_id === user?.id && r.status === 'pending')
    if (userPending) {
      setPendingRequest(userPending)
    } else {
      setPendingRequest(null)
    }
    
    setIsChecking(false)
  }
  
  // Listen for storage changes (when admin approves from another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'approved_birthday_users' || e.key === 'birthday_requests') {
        console.log('Storage changed, rechecking birthday status...')
        checkBirthdayStatus()
        toast.info('Your birthday offer status has been updated!', { duration: 3000 })
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [user])
  
  useEffect(() => {
    if (user) {
      checkBirthdayStatus()
    }
  }, [user])
  
  const calculateFinalAmount = () => {
    let finalAmount = totalAmount + (formData.tip_amount || 0)
    
    if (birthdayOffer?.active && totalAmount >= 1000) {
      finalAmount = finalAmount * 0.5
    }
    
    return finalAmount
  }
  
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
    
    const finalAmount = calculateFinalAmount()
    const discountAmount = (totalAmount + (formData.tip_amount || 0)) - finalAmount
    
    const orderData = {
      items: items.map(item => ({
        food_id: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      })),
      total_amount: finalAmount,
      original_amount: totalAmount + (formData.tip_amount || 0),
      discount_amount: discountAmount,
      discount_type: birthdayOffer?.active ? 'birthday' : null,
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
        toast.success('Order placed successfully! Food will be served at your table.')
        navigate('/orders')
      }
    })
  }
  
  const handleBirthdayRequestSubmitted = () => {
    checkBirthdayStatus()
  }
  
  if (items.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
        <FiShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some delicious items from our menu!</p>
        <button onClick={() => navigate('/menu')} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all">
          Browse Menu
        </button>
      </motion.div>
    )
  }
  
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading offers...</p>
        </div>
      </div>
    )
  }
  
  const finalAmount = calculateFinalAmount()
  const discountAmount = (totalAmount + (formData.tip_amount || 0)) - finalAmount
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Order ({totalItems} items)
        </h1>
        
        {/* Show discount banner if offer applied */}
        {birthdayOffer?.active && discountAmount > 0 && totalAmount >= 1000 && (
          <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg text-center animate-pulse">
            <p className="text-green-700 font-semibold flex items-center justify-center gap-2">
              <FiGift className="w-5 h-5" />
              🎉 Happy Birthday! You saved ₹{discountAmount.toFixed(0)} (50% OFF) 🎉
            </p>
          </div>
        )}
        
        {/* Success message after approval */}
        {birthdayOffer?.active && !discountAmount && totalAmount < 1000 && (
          <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded-lg text-center">
            <p className="text-blue-700 font-semibold flex items-center justify-center gap-2">
              <FiGift className="w-5 h-5" />
              Happy Birthday! Add items worth ₹{1000 - totalAmount} more to get 50% OFF!
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
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
                  <img 
                    src={item.image_url || item.image || 'https://placehold.co/80'} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => { e.target.src = 'https://placehold.co/80?text=Food' }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-blue-600 font-bold">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} 
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors w-8 h-8 flex items-center justify-center"
                    >
                      <FiMinus />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} 
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors w-8 h-8 flex items-center justify-center"
                    >
                      <FiPlus />
                    </button>
                    <button 
                      onClick={() => dispatch(removeFromCart(item.id))} 
                      className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors w-8 h-8 flex items-center justify-center"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Order Form & Summary */}
          <div className="space-y-4">
            {/* Birthday Offer Button / Status */}
            {!birthdayOffer?.active && !pendingRequest && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowBirthdayRequest(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white p-4 rounded-xl shadow-md flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <FiGift className="w-6 h-6 animate-float" />
                  <div className="text-left">
                    <p className="font-semibold">Birthday Offer!</p>
                    <p className="text-xs text-white/80">Get 50% off on ₹1000+ orders</p>
                  </div>
                </div>
                <FiTag className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            )}
            
            {pendingRequest && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FiLoader className="w-5 h-5 text-yellow-500 animate-spin" />
                  <span className="text-yellow-700 font-semibold">Verification Pending</span>
                </div>
                <p className="text-xs text-yellow-600">
                  Your birthday request is pending admin approval. You'll get 50% OFF once approved!
                </p>
              </div>
            )}
            
            {birthdayOffer?.active && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <FiCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 font-semibold">Offer Approved! 🎉</span>
                </div>
                <p className="text-xs text-green-600">
                  Your birthday offer is active! Add items worth ₹1000+ to get 50% OFF.
                </p>
              </div>
            )}
            
            {/* Customer Details Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiUser className="text-blue-500" /> Customer Details
              </h2>
              <div className="space-y-3">
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({...formData, customer_phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email (optional)"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({...formData, customer_email: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Table Details Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FiUsers className="text-green-500" /> Table Details
              </h2>
              <div className="space-y-3">
                <div className="relative">
                  <FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    placeholder="Number of People *"
                    value={formData.number_of_people}
                    onChange={(e) => setFormData({...formData, number_of_people: parseInt(e.target.value) || 1})}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
                <div className="relative">
                  <FiMessageCircle className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    placeholder="Special Instructions (optional)"
                    value={formData.special_instructions}
                    onChange={(e) => setFormData({...formData, special_instructions: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  />
                </div>
              </div>
            </div>
            
            {/* Order Summary Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 border-b pb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 font-semibold">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Number of People</span>
                  <span>{formData.number_of_people}</span>
                </div>
                
                {birthdayOffer?.active && totalAmount >= 1000 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Birthday Discount (50%)</span>
                    <span>-₹{(totalAmount * 0.5).toFixed(0)}</span>
                  </div>
                )}
              </div>
              
              {/* Tip Section */}
              <div className="mt-4">
                <button
                  onClick={() => setShowTipOptions(!showTipOptions)}
                  className="flex justify-between items-center w-full py-2"
                >
                  <span className="flex items-center gap-2">
                    <FiDollarSign className="text-green-500" />
                    <span>Add Tip (Optional)</span>
                  </span>
                  <span className="text-blue-500">
                    {formData.tip_amount > 0 ? `₹${formData.tip_amount}` : 'Add'}
                  </span>
                </button>
                
                <AnimatePresence>
                  {showTipOptions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2"
                    >
                      <div className="flex flex-wrap gap-2">
                        {tipOptions.map((tip) => (
                          <button
                            key={tip}
                            onClick={() => {
                              setFormData({...formData, tip_amount: tip})
                              setShowTipOptions(false)
                            }}
                            className={`px-3 py-1 rounded-full text-sm transition-all ${
                              formData.tip_amount === tip
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {tip === 0 ? 'No Tip' : `₹${tip}`}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Total */}
              <div className="flex justify-between mt-4 pt-4 border-t font-bold text-lg">
                <span>Total to Pay</span>
                <span className="text-blue-600">₹{finalAmount.toFixed(0)}</span>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-green-700 flex items-center gap-1">
                  <FiCheckCircle className="w-3 h-3" />
                  Food will be served at your table. No delivery charges.
                </p>
              </div>
              
              <button
                onClick={handlePlaceOrder}
                disabled={createOrderMutation.isPending}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <FiCoffee className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {showBirthdayRequest && (
        <BirthdayRequest
          user={user}
          onClose={() => setShowBirthdayRequest(false)}
          onRequestSubmitted={handleBirthdayRequestSubmitted}
        />
      )}
    </>
  )
}

export default Cart
