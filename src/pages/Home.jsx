import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiCoffee, FiUsers, FiHeart, FiStar, FiClock, FiTruck } from 'react-icons/fi'
import InfoPopup from '../components/ui/InfoPopup'

const Home = () => {
  const [popupType, setPopupType] = useState(null)

  const features = [
    { 
      icon: FiCoffee, 
      title: 'Delicious Food', 
      description: 'Freshly prepared meals made with love',
      type: 'food',
      gradient: 'from-orange-400 to-red-500',
      delay: 0
    },
    { 
      icon: FiUsers, 
      title: 'Quick Table Service', 
      description: 'Fresh food served at your table in minutes',
      type: 'service',
      gradient: 'from-sky-400 to-blue-500',
      delay: 0.1
    },
    { 
      icon: FiHeart, 
      title: 'Healthy Options', 
      description: 'Nutritious meals for everyone',
      type: 'healthy',
      gradient: 'from-green-400 to-emerald-500',
      delay: 0.2
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 12 }
    }
  }

  const heroVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, type: 'spring' }
    }
  }

  const handleCardClick = (type) => {
    setPopupType(type)
  }

  return (
    <>
      <div className="space-y-20 animate-fade-up">
        {/* Hero Section */}
        <motion.section 
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="relative text-center py-20 md:py-28 bg-gradient-to-r from-sky-500 via-sky-400 to-red-400 rounded-3xl text-white overflow-hidden group"
        >
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-500"></div>
          <div className="absolute top-10 left-10 text-7xl animate-float opacity-20">🍔</div>
          <div className="absolute bottom-10 right-10 text-7xl animate-float opacity-20" style={{animationDelay: '1s'}}>🍕</div>
          <div className="relative z-10 px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-4"
            >
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                🎉 Limited Time Offers 🎉
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-float">
              Welcome to <span className="text-yellow-300">CanteenHub</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Delicious food served fresh at your table with love
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center bg-white text-sky-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 transform group"
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
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(feature.type)}
              className={`text-center p-8 bg-gradient-to-br ${feature.gradient} rounded-2xl shadow-xl cursor-pointer transition-all duration-300 group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
              <div className="relative z-10">
                <feature.icon className="w-16 h-16 text-white mx-auto mb-4 animate-float" />
                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/90">{feature.description}</p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-white text-sm inline-flex items-center gap-1">
                    Click to learn more
                    <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>
        
        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4"
        >
          {[
            { value: "500+", label: "Daily Orders", icon: FiClock },
            { value: "50+", label: "Food Items", icon: FiCoffee },
            { value: "10K+", label: "Happy Customers", icon: FiStar },
            { value: "25+", label: "Dining Tables", icon: FiUsers },
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-6 bg-white rounded-2xl shadow-lg card-hover">
              <stat.icon className="w-10 h-10 text-sky-500 mx-auto mb-3" />
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.section>
        
        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-12 text-center text-white relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 to-red-500/10 group-hover:opacity-100 transition-all duration-500"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to order?</h2>
            <p className="text-lg mb-6">Browse our menu and place your order now!</p>
            <Link
              to="/menu"
              className="inline-flex items-center bg-gradient-to-r from-sky-500 to-red-500 px-8 py-4 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 transform group"
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
