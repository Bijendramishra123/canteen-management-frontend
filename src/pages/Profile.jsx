import React from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiShield, FiCalendar, FiAward, FiHeart } from 'react-icons/fi'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Please login to view profile</p>
      </div>
    )
  }

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
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        My Profile
      </h1>
      
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold backdrop-blur-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <FiShield className="w-4 h-4" />
                <p className="text-blue-100 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <motion.div variants={itemVariants} className="flex items-center gap-3 pb-3 border-b">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FiUser className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-3 pb-3 border-b">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FiMail className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-3 pb-3 border-b">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <FiShield className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium capitalize">{user.role}</p>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <FiCalendar className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Loyalty Badge */}
      <motion.div variants={itemVariants} className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center animate-float">
            <FiAward className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-yellow-800">Loyal Customer</h3>
            <p className="text-sm text-yellow-600">You're a valued customer! Keep ordering to unlock more rewards.</p>
          </div>
          <FiHeart className="text-yellow-500 ml-auto w-6 h-6" />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Profile
