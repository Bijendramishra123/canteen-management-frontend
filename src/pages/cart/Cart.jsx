import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiUser, FiPhone, 
  FiMail, FiUsers, FiDollarSign, FiMessageCircle, FiCoffee, 
  FiCheckCircle, FiAlertCircle, FiGift, FiTag 
} from 'react-icons/fi'
import { removeFromCart, updateQuantity, clearCart } from '../../redux/slices/cartSlice'
import { useCreateOrder } from '../../hooks/queries/useOrders'
import BirthdayRequest from '../../components/ui/BirthdayRequest'
import RazorpayPayment from '../../components/payment/RazorpayPayment'
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
  
  const [errors, setErrors] = useState({})
  const [showTipOptions, setShowTipOptions] = useState(false)
  const [showBirthdayRequest, setShowBirthdayRequest] = useState(false)
  const [appliedOffer, setAppliedOffer] = useState(null)
  const [hasBirthdayOffer, setHasBirthdayOffer] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  
  const tipOptions = [0, 20, 50, 100, 200]
  
  React.useEffect(() => {
    const approvedUsers = JSON.parse(localStorage.getItem('approved_birthday_users') || '[]')
    const userApproved = approvedUsers.find(u => u.user_id === user?.id)
    
    if (userApproved) {
      const today = new Date()
      const birthDate = new Date(userApproved.birth_date)
      const isBirthdayToday = birthDate.getDate() === today.getDate() && birthDate.getMonth() === today.getMonth()
      
      if (isBirthdayToday) {
        setHasBirthdayOffer(true)
        setAppliedOffer({
          type: 'birthday',
          message: '🎉 Happy Birthday! 50% discount applied!',
          discount: 50
        })
      }
    }
  }, [user])

  const validateName = (name) => {
    if (!name) return 'Name is required'
    if (name.length < 2) return 'Name must be at least 2 characters'
    if (/[0-9]/.test(name)) return 'Name cannot contain numbers'
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(name)) return 'Name cannot contain special characters'
    return ''
  }

  const validatePhoneNumber = (phone) => {
    if (!phone) return 'Phone number is required'
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(phone)) return 'Please enter a valid 10-digit mobile number'
    return ''
  }

  const validateNumberOfPeople = (num) => {
    if (!num || num < 1) return 'At least 1 person required'
    if (num > 20) return 'Maximum 20 people allowed per table'
    return ''
  }

  const handleNameChange = (value) => {
    const lettersOnly = value.replace(/[0-9!@#$%^&*()_+=[\]{};:<>/?]/g, '')
    setFormData({...formData, customer_name: lettersOnly})
    setErrors({...errors, customer_name: validateName(lettersOnly)})
  }

  const handlePhoneChange = (value) => {
    const numbersOnly = value.replace(/[^0-9]/g, '').slice(0, 10)
    setFormData({...formData, customer_phone: numbersOnly})
    setErrors({...errors, customer_phone: validatePhoneNumber(numbersOnly)})
  }

  const handlePeopleChange = (value) => {
    const numValue = parseInt(value) || 1
    const validNum = Math.min(Math.max(numValue, 1), 20)
    setFormData({...formData, number_of_people: validNum})
    setErrors({...errors, number_of_people: validateNumberOfPeople(validNum)})
  }

  const validateForm = () => {
    const newErrors = {
      customer_name: validateName(formData.customer_name),
      customer_phone: validatePhoneNumber(formData.customer_phone),
      number_of_people: validateNumberOfPeople(formData.number_of_people)
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }
  
  const calculateFinalAmount = () => {
    let finalAmount = totalAmount + (formData.tip_amount || 0)
    if (hasBirthdayOffer && appliedOffer && totalAmount >= 1000) {
      finalAmount = finalAmount * 0.5
    }
    return finalAmount
  }
  
  const handleUpdateQuantity = (id, quantity) => {
    if (quantity < 1) return
    dispatch(updateQuantity({ id, quantity }))
  }
  
  const handlePaymentSuccess = (paymentData) => {
    // After successful payment, create order
    const finalAmount = calculateFinalAmount()
    
    const orderData = {
      items: items.map(item => ({
        food_id: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      })),
      total_amount: finalAmount,
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
        toast.success('Payment successful! Order placed. Food will be served at your table.')
        navigate('/orders')
      }
    })
  }
  
  const handlePaymentFailure = (error) => {
    toast.error('Payment failed. Please try again.')
  }
  
  const handleBirthdayRequestSubmitted = () => {
    toast.success('Request submitted! Admin will verify within 24 hours.')
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
  
  const finalAmount = calculateFinalAmount()
  
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Order ({totalItems} items)
        </h1>
        
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
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full hover:bg-gray-100 w-8 h-8 flex items-center justify-center"><FiMinus /></button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full hover:bg-gray-100 w-8 h-8 flex items-center justify-center"><FiPlus /></button>
                    <button onClick={() => dispatch(removeFromCart(item.id))} className="p-1 text-red-500 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center"><FiTrash2 /></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Order Form & Summary */}
          <div className="space-y-4">
            {!hasBirthdayOffer && (
              <button onClick={() => setShowBirthdayRequest(true)} className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white p-4 rounded-xl shadow-md flex items-center justify-between group">
                <div className="flex items-center gap-3"><FiGift className="w-6 h-6 animate-float" /><div className="text-left"><p className="font-semibold">Birthday Offer!</p><p className="text-xs text-white/80">Get 50% off on ₹1000+ orders</p></div></div>
                <FiTag className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            
            {hasBirthdayOffer && appliedOffer && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /><span className="text-sm text-green-700">{appliedOffer.message}</span></div>
              </div>
            )}
            
            {/* Customer Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FiUser className="text-blue-500" /> Customer Details</h2>
              <div className="space-y-3">
                <div><div className="relative"><FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Full Name *" value={formData.customer_name} onChange={(e) => handleNameChange(e.target.value)} className={`w-full pl-10 pr-4 py-2 border rounded-lg ${errors.customer_name ? 'border-red-500' : 'border-gray-300'}`} /></div>{errors.customer_name && <p className="text-xs text-red-500 mt-1"><FiAlertCircle className="inline w-3 h-3 mr-1" />{errors.customer_name}</p>}</div>
                <div><div className="relative"><FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="tel" placeholder="Phone Number * (10 digits)" value={formData.customer_phone} onChange={(e) => handlePhoneChange(e.target.value)} className={`w-full pl-10 pr-4 py-2 border rounded-lg ${errors.customer_phone ? 'border-red-500' : 'border-gray-300'}`} maxLength="10" /></div>{errors.customer_phone && <p className="text-xs text-red-500 mt-1"><FiAlertCircle className="inline w-3 h-3 mr-1" />{errors.customer_phone}</p>}</div>
                <div className="relative"><FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="email" placeholder="Email (optional)" value={formData.customer_email} onChange={(e) => setFormData({...formData, customer_email: e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-lg" /></div>
              </div>
            </div>
            
            {/* Table Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FiUsers className="text-green-500" /> Table Details</h2>
              <div className="space-y-3">
                <div><div className="relative"><FiUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="number" placeholder="Number of People *" value={formData.number_of_people} onChange={(e) => handlePeopleChange(e.target.value)} className={`w-full pl-10 pr-4 py-2 border rounded-lg ${errors.number_of_people ? 'border-red-500' : 'border-gray-300'}`} min="1" max="20" /></div>{errors.number_of_people && <p className="text-xs text-red-500 mt-1"><FiAlertCircle className="inline w-3 h-3 mr-1" />{errors.number_of_people}</p>}</div>
                <div className="relative"><FiMessageCircle className="absolute left-3 top-3 text-gray-400" /><textarea placeholder="Special Instructions (optional)" value={formData.special_instructions} onChange={(e) => setFormData({...formData, special_instructions: e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-lg" rows="2" /></div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 border-b pb-4">
                {items.map((item) => (<div key={item.id} className="flex justify-between text-sm"><span>{item.quantity}x {item.name}</span><span>₹{item.price * item.quantity}</span></div>))}
                <div className="flex justify-between pt-2 font-semibold"><span>Subtotal</span><span>₹{totalAmount}</span></div>
                <div className="flex justify-between text-sm text-gray-600"><span>Number of People</span><span>{formData.number_of_people}</span></div>
                {hasBirthdayOffer && totalAmount >= 1000 && (<div className="flex justify-between text-green-600 font-semibold"><span>Birthday Discount (50%)</span><span>-₹{(totalAmount * 0.5).toFixed(0)}</span></div>)}
              </div>
              
              <div className="mt-4"><button onClick={() => setShowTipOptions(!showTipOptions)} className="flex justify-between items-center w-full py-2"><span className="flex items-center gap-2"><FiDollarSign className="text-green-500" /><span>Add Tip (Optional)</span></span><span className="text-blue-500">{formData.tip_amount > 0 ? `₹${formData.tip_amount}` : 'Add'}</span></button>
              <AnimatePresence>{showTipOptions && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2"><div className="flex flex-wrap gap-2">{tipOptions.map((tip) => (<button key={tip} onClick={() => { setFormData({...formData, tip_amount: tip}); setShowTipOptions(false) }} className={`px-3 py-1 rounded-full text-sm transition-all ${formData.tip_amount === tip ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{tip === 0 ? 'No Tip' : `₹${tip}`}</button>))}</div></motion.div>)}</AnimatePresence></div>
              
              <div className="flex justify-between mt-4 pt-4 border-t font-bold text-lg"><span>Total to Pay</span><span className="text-blue-600">₹{finalAmount.toFixed(0)}</span></div>
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200"><p className="text-xs text-green-700 flex items-center gap-1"><FiCheckCircle className="w-3 h-3" /> Food will be served at your table. No delivery charges.</p></div>
              
              <RazorpayPayment 
                amount={finalAmount}
                orderDetails={{
                  customerName: formData.customer_name,
                  customerEmail: formData.customer_email,
                  customerPhone: formData.customer_phone
                }}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
              />
              
              <p className="text-xs text-gray-500 text-center mt-3">By placing order, you confirm that you will be seated at a table in the canteen.</p>
            </div>
          </div>
        </div>
      </div>
      
      {showBirthdayRequest && <BirthdayRequest user={user} onClose={() => setShowBirthdayRequest(false)} onRequestSubmitted={handleBirthdayRequestSubmitted} />}
    </>
  )
}

export default Cart
