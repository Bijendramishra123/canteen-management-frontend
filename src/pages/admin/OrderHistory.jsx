import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ordersApi } from '../../api/endpoints/orders'
import { 
  FiPackage, FiClock, FiCheckCircle, FiTruck, FiCoffee, 
  FiUser, FiPhone, FiMail, FiUsers, FiDollarSign, 
  FiSearch, FiFilter, FiCalendar, FiDownload, FiX 
} from 'react-icons/fi'
import toast from 'react-hot-toast'

const OrderHistory = () => {
  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ['all-orders'],
    queryFn: () => ordersApi.getOrders().then(res => res.data)
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Date filter logic
  const filterByDate = (order) => {
    const orderDate = new Date(order.created_at)
    const today = new Date()
    const oneDayAgo = new Date(today.setDate(today.getDate() - 1))
    const oneWeekAgo = new Date(today.setDate(today.getDate() - 7))
    const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1))
    const oneYearAgo = new Date(today.setFullYear(today.getFullYear() - 1))

    switch(dateRange) {
      case 'today':
        return orderDate.toDateString() === new Date().toDateString()
      case 'yesterday':
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        return orderDate.toDateString() === yesterday.toDateString()
      case 'week':
        return orderDate >= oneWeekAgo
      case 'month':
        return orderDate >= oneMonthAgo
      case 'year':
        return orderDate >= oneYearAgo
      default:
        return true
    }
  }

  // Apply filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toString().includes(searchTerm) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone?.includes(searchTerm)
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    const matchesDate = filterByDate(order)
    
    return matchesSearch && matchesStatus && matchesDate
  })

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

  // Stats for filtered data
  const stats = {
    total: filteredOrders.length,
    totalRevenue: filteredOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    delivered: filteredOrders.filter(o => o.status === 'delivered').length,
  }

  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Total Amount', 'Status', 'Items', 'Created At']
    const csvData = filteredOrders.map(order => [
      order.id,
      order.customer_name || 'N/A',
      order.customer_email || 'N/A',
      order.customer_phone || 'N/A',
      order.total_amount,
      order.status,
      order.items?.length || 0,
      new Date(order.created_at).toLocaleString()
    ])
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders_${new Date().toISOString()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Report exported successfully!')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Order History
          </h1>
          <p className="text-gray-500 mt-1">View and filter all orders from your canteen</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          <FiDownload /> Export Report
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-gray-500 text-sm">Pending Orders</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <p className="text-gray-500 text-sm">Delivered</p>
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, Email or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-50"
            >
              <FiFilter /> Filters
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-4 mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="year">Last Year</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setFilterStatus('all')
                    setDateRange('all')
                  }}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.03 }}
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
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">₹{order.total_amount}</p>
                      <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <FiUser className="text-gray-400" />
                      <span>{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiPhone className="text-gray-400" />
                      <span>{order.customer_phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiMail className="text-gray-400" />
                      <span>{order.customer_email || 'N/A'}</span>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-semibold mb-2">Order Items:</p>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {item.quantity}x {item.name || `Item ${item.food_id}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-2">Try changing your filters</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default OrderHistory
