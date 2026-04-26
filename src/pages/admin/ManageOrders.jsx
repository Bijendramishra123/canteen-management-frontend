import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ordersApi } from '../../api/endpoints/orders'
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiCoffee, FiUser, FiPhone, FiMail, FiUsers, FiDollarSign, FiMessageCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

const ManageOrders = () => {
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['all-orders'],
    queryFn: () => ordersApi.getOrders().then(res => res.data)
  })

  const [updatingId, setUpdatingId] = useState(null)
  const [filter, setFilter] = useState('all')

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      preparing: 'bg-purple-100 text-purple-800 border-purple-200',
      ready: 'bg-green-100 text-green-800 border-green-200',
      delivered: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <FiClock className="w-4 h-4" />
      case 'confirmed': return <FiCheckCircle className="w-4 h-4" />
      case 'preparing': return <FiCoffee className="w-4 h-4" />
      case 'ready': return <FiTruck className="w-4 h-4" />
      case 'delivered': return <FiPackage className="w-4 h-4" />
      default: return <FiClock className="w-4 h-4" />
    }
  }

  const updateStatus = async (orderId, newStatus) => {
    if (!orderId) {
      toast.error('Invalid Order ID')
      return
    }
    setUpdatingId(orderId)
    try {
      await ordersApi.updateOrderStatus(orderId, newStatus)
      toast.success(`Order #${orderId} status updated to ${newStatus}`)
      refetch()
    } catch (error) {
      toast.error('Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }

  if (isLoading) return <div className="text-center py-8">Loading orders...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Manage Orders
        </h1>
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                filter === status 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({stats[status] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(stats).map(([key, value]) => (
          <motion.div key={key} whileHover={{ scale: 1.05 }} className={`bg-white rounded-xl shadow-md p-3 text-center border-l-4 ${
            key === 'pending' ? 'border-yellow-500' :
            key === 'confirmed' ? 'border-blue-500' :
            key === 'preparing' ? 'border-purple-500' :
            key === 'ready' ? 'border-green-500' :
            key === 'delivered' ? 'border-gray-500' :
            'border-blue-500'
          }`}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-gray-500 capitalize">{key}</p>
          </motion.div>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOrders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-5">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      #{order.id}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{order.customer_name || 'Customer'}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {order.status?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Order placed: {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">₹{order.total_amount}</p>
                    {order.tip_amount > 0 && <p className="text-xs text-gray-500">Tip: ₹{order.tip_amount}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm"><FiUser className="text-gray-400" /> {order.customer_name}</p>
                    <p className="flex items-center gap-2 text-sm"><FiPhone className="text-gray-400" /> {order.customer_phone || 'N/A'}</p>
                    <p className="flex items-center gap-2 text-sm"><FiMail className="text-gray-400" /> {order.customer_email || 'N/A'}</p>
                    <p className="flex items-center gap-2 text-sm"><FiUsers className="text-gray-400" /> {order.number_of_people || 1} people</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-sm">Items:</p>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name || `Item ${item.food_id}`}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    {order.special_instructions && (
                      <p className="flex items-start gap-2 text-sm mt-2 pt-2 border-t"><FiMessageCircle className="text-gray-400 mt-0.5" /> {order.special_instructions}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-4 pt-4 border-t">
                  <select
                    value={order.status || 'pending'}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">⚪ Delivered</option>
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">No orders found</div>
        )}
      </div>
    </div>
  )
}

export default ManageOrders
