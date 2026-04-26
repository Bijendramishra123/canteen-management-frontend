import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCoffee, FiUsers, FiHeart } from 'react-icons/fi'
import InfoPopup from '../components/ui/InfoPopup'

const Home = () => {
  const [popupType, setPopupType] = useState(null)

  const features = [
    { 
      icon: FiCoffee, 
      title: 'Delicious Food', 
      description: 'Freshly prepared meals made with love',
      type: 'food',
      gradient: 'from-orange-500 to-red-500'
    },
    { 
      icon: FiUsers, 
      title: 'Quick Table Service', 
      description: 'Fresh food served at your table in minutes',
      type: 'service',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: FiHeart, 
      title: 'Healthy Options', 
      description: 'Nutritious meals for everyone',
      type: 'healthy',
      gradient: 'from-green-500 to-emerald-500'
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  }

  const handleCardClick = (type) => {
    setPopupType(type)
  }

  return (
    <>
      <div className="space-y-16">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500"></div>
          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-float">
              Welcome to Canteen Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Delicious food served fresh at your table
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
            >
              Order Now
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.section>
        
        {/* Features Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(feature.type)}
              className={`text-center p-8 bg-gradient-to-br ${feature.gradient} rounded-2xl shadow-lg cursor-pointer transition-all duration-300 group relative overflow-hidden`}
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
              
              <div className="relative z-10">
                <feature.icon className="w-16 h-16 text-white mx-auto mb-4 animate-float" />
                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/90">{feature.description}</p>
                
                {/* Learn more indicator */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-white text-sm inline-flex items-center gap-1">
                    Click to learn more
                    <FiArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>
        
        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-12 text-center text-white relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready to order?</h2>
            <p className="text-lg mb-6">Browse our menu and place your order now!</p>
            <Link
              to="/menu"
              className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
            >
              View Menu
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.section>
      </div>

      {/* Popup */}
      <InfoPopup 
        isOpen={!!popupType}
        onClose={() => setPopupType(null)}
        type={popupType}
      />
    </>
  )
}

export default Home
