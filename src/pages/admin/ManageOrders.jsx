import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ordersApi } from '../../api/endpoints/orders'
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiCoffee, FiUser, FiPhone, FiMail, FiUsers, FiDollarSign, FiMessageCircle, FiFilter, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

const ManageOrders = () => {
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['all-orders'],
    queryFn: () => ordersApi.getOrders().then(res => res.data)
  })

  const [updatingId, setUpdatingId] = useState(null)
  const [filter, setFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800'
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
    <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Manage Orders
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50 text-sm"
        >
          <FiFilter /> Filters
        </button>
      </div>

      {/* Filter Tabs - Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto pb-2 -mx-3 px-3">
        <div className="flex gap-2 min-w-max">
          {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
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
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className={`bg-white rounded-xl shadow-md p-2 sm:p-3 text-center border-l-4 ${
            key === 'pending' ? 'border-yellow-500' :
            key === 'confirmed' ? 'border-blue-500' :
            key === 'preparing' ? 'border-purple-500' :
            key === 'ready' ? 'border-green-500' :
            key === 'delivered' ? 'border-gray-500' :
            'border-blue-500'
          }`}>
            <p className="text-lg sm:text-2xl font-bold">{value}</p>
            <p className="text-xs text-gray-500 capitalize">{key}</p>
          </div>
        ))}
      </div>

      {/* Orders List - Mobile Responsive */}
      <div className="space-y-3 sm:space-y-4">
        <AnimatePresence>
          {filteredOrders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="p-3 sm:p-5">
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                      #{order.id}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base sm:text-lg">{order.customer_name || 'Customer'}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {order.status?.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right w-full sm:w-auto">
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">₹{order.total_amount}</p>
                    {order.tip_amount > 0 && <p className="text-xs text-gray-500">Tip: ₹{order.tip_amount}</p>}
                  </div>
                </div>

                {/* Order Details - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 pt-3 border-t">
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-xs sm:text-sm"><FiUser className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" /> {order.customer_name}</p>
                    <p className="flex items-center gap-2 text-xs sm:text-sm"><FiPhone className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" /> {order.customer_phone || 'N/A'}</p>
                    <p className="flex items-center gap-2 text-xs sm:text-sm"><FiMail className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" /> {order.customer_email || 'N/A'}</p>
                    <p className="flex items-center gap-2 text-xs sm:text-sm"><FiUsers className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" /> {order.number_of_people || 1} people</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-sm">Items:</p>
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs sm:text-sm">
                        <span>{item.quantity}x {item.name || `Item ${item.food_id}`}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                    {order.special_instructions && (
                      <p className="flex items-start gap-2 text-xs sm:text-sm mt-2 pt-2 border-t"><FiMessageCircle className="text-gray-400 mt-0.5 w-4 h-4" /> {order.special_instructions}</p>
                    )}
                  </div>
                </div>

                {/* Status Update */}
                <div className="flex justify-end mt-3 pt-3 border-t">
                  <select
                    value={order.status || 'pending'}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className="px-3 py-1.5 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="pending">🟡 Pending</option>
                    <option value="confirmed">🔵 Confirmed</option>
                    <option value="preparing">🟣 Preparing</option>
                    <option value="ready">🟢 Ready</option>
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
