import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ordersApi } from '../../api/endpoints/orders'
import { menuApi } from '../../api/endpoints/menu'
import { FiPackage, FiMenu, FiUsers, FiDollarSign, FiShoppingBag, FiTrendingUp, FiClock, FiCheckCircle } from 'react-icons/fi'

const AdminDashboard = () => {
  const { data: orders = [] } = useQuery({
    queryKey: ['all-orders'],
    queryFn: () => ordersApi.getOrders().then(res => res.data)
  })
  
  const { data: foods = [] } = useQuery({
    queryKey: ['all-foods'],
    queryFn: () => menuApi.getFoods().then(res => res.data)
  })

  // Calculate stats
  const totalRevenue = orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + (order.total_amount || 0), 0)
  
  const pendingOrders = orders.filter(order => order.status === 'pending').length
  const completedOrders = orders.filter(order => order.status === 'delivered').length
  const uniqueUserIds = new Set(orders.map(order => order.customer_email).filter(Boolean))
  const totalUsers = uniqueUserIds.size

  const stats = [
    { title: 'Total Orders', value: orders.length, icon: FiPackage, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-100', textColor: 'text-blue-600', delay: 0 },
    { title: 'Pending Orders', value: pendingOrders, icon: FiClock, color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600', delay: 0.1 },
    { title: 'Completed', value: completedOrders, icon: FiCheckCircle, color: 'from-green-500 to-green-600', bgColor: 'bg-green-100', textColor: 'text-green-600', delay: 0.2 },
    { title: 'Food Items', value: foods.length, icon: FiMenu, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-100', textColor: 'text-purple-600', delay: 0.3 },
    { title: 'Total Users', value: totalUsers, icon: FiUsers, color: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-100', textColor: 'text-indigo-600', delay: 0.4 },
    { title: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: 'from-emerald-500 to-emerald-600', bgColor: 'bg-emerald-100', textColor: 'text-emerald-600', delay: 0.5 },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your canteen today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/foods" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
            <FiMenu /> Manage Foods
          </Link>
          <Link to="/admin/orders" className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
            <FiShoppingBag /> View Orders
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            transition={{ delay: stat.delay }}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-full`}>
                <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiTrendingUp className="text-blue-500" /> Recent Orders
            </h2>
            <p className="text-gray-500 text-sm mt-1">Latest 5 orders from customers</p>
          </div>
          <Link to="/admin/orders" className="text-blue-500 hover:text-blue-600 text-sm font-medium">
            View All →
          </Link>
        </div>
        
        <div className="space-y-3">
          {orders.slice(0, 5).map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiShoppingBag className="text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{order.customer_name || 'Customer'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">₹{order.total_amount}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {order.status}
                </span>
              </div>
            </motion.div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No orders yet
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/foods" className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-xl transition-all transform hover:scale-105">
          <FiMenu className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-semibold">Manage Menu</h3>
          <p className="mt-2 opacity-90">Add, edit, or remove food items from your canteen menu</p>
        </Link>
        
        <Link to="/admin/orders" className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white hover:shadow-xl transition-all transform hover:scale-105">
          <FiShoppingBag className="w-10 h-10 mb-4" />
          <h3 className="text-xl font-semibold">Manage Orders</h3>
          <p className="mt-2 opacity-90">View and update order statuses in real-time</p>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default AdminDashboard
