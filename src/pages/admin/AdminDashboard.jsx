import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { FiPackage, FiMenu, FiUsers, FiDollarSign, FiShoppingBag, FiTrendingUp, FiClock, FiCheckCircle, FiCalendar, FiDownload, FiGrid, FiList } from 'react-icons/fi'

const API_URL = 'https://canteen-management-backend-vj7n.onrender.com/api'

const AdminDashboard = () => {
  const [orders, setOrders] = useState([])
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('grid')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const headers = { Authorization: `Bearer ${token}` }
      
      const [ordersRes, foodsRes] = await Promise.all([
        axios.get(`${API_URL}/orders`, { headers }),
        axios.get(`${API_URL}/foods`, { headers })
      ])
      
      setOrders(ordersRes.data)
      setFoods(foodsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + (order.total_amount || 0), 0)
  
  const pendingOrders = orders.filter(order => order.status === 'pending').length
  const preparingOrders = orders.filter(order => order.status === 'preparing').length
  const completedOrders = orders.filter(order => order.status === 'delivered').length
  
  const uniqueCustomers = new Set()
  orders.forEach(order => {
    if (order.customer_email) uniqueCustomers.add(order.customer_email)
  })
  const totalCustomers = uniqueCustomers.size

  const today = new Date().toDateString()
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at).toDateString()
    return orderDate === today
  })
  const todayRevenue = todayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)

  const stats = [
    { title: 'Total Orders', value: orders.length, icon: FiPackage, bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
    { title: 'Pending', value: pendingOrders, icon: FiClock, bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
    { title: 'Preparing', value: preparingOrders, icon: FiTrendingUp, bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
    { title: 'Completed', value: completedOrders, icon: FiCheckCircle, bgColor: 'bg-green-100', textColor: 'text-green-600' },
    { title: 'Food Items', value: foods.length, icon: FiMenu, bgColor: 'bg-orange-100', textColor: 'text-orange-600' },
    { title: 'Customers', value: totalCustomers, icon: FiUsers, bgColor: 'bg-indigo-100', textColor: 'text-indigo-600' },
    { title: "Today's Revenue", value: `₹${todayRevenue}`, icon: FiDollarSign, bgColor: 'bg-emerald-100', textColor: 'text-emerald-600' },
    { title: 'Total Revenue', value: `₹${totalRevenue}`, icon: FiDollarSign, bgColor: 'bg-green-100', textColor: 'text-green-600' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/history" className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-3 py-2 rounded-lg text-sm hover:shadow-lg transition-all flex items-center gap-1">
            <FiCalendar className="w-4 h-4" /> <span className="hidden sm:inline">View History</span>
          </Link>
          <Link to="/admin/foods" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:shadow-lg transition-all flex items-center gap-1">
            <FiMenu className="w-4 h-4" /> <span className="hidden sm:inline">Manage Foods</span>
          </Link>
          <Link to="/admin/orders" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-2 rounded-lg text-sm hover:shadow-lg transition-all flex items-center gap-1">
            <FiShoppingBag className="w-4 h-4" /> <span className="hidden sm:inline">View Orders</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid - Mobile Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-3 sm:p-4 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-2 sm:p-3 rounded-full`}>
                <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <FiTrendingUp className="text-blue-500" /> Recent Orders
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1">Latest orders from customers</p>
          </div>
          <Link to="/admin/orders" className="text-blue-500 hover:text-blue-600 text-sm font-medium">View All →</Link>
        </div>
        
        {/* Mobile: Card View, Desktop: List View */}
        <div className="space-y-3">
          {orders.slice(0, 5).map((order, idx) => (
            <div key={order.id} className="bg-gray-50 rounded-lg p-3 sm:p-4 hover:bg-gray-100 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FiShoppingBag className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm sm:text-base">Order #{order.id}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{order.customer_name || 'Customer'}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <p className="font-bold text-blue-600 text-sm sm:text-base">₹{order.total_amount}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                    order.status === 'preparing' ? 'bg-purple-100 text-purple-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">No orders yet</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
