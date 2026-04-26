import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCoffee, FiClock, FiHeart, FiCheckCircle, FiStar, FiUsers, FiSmile } from 'react-icons/fi'

const InfoPopup = ({ isOpen, onClose, type }) => {
  const content = {
    food: {
      title: "🍽️ Delicious Food",
      icon: <FiCoffee className="w-12 h-12" />,
      color: "from-orange-500 to-red-500",
      description: "Our chefs prepare every meal with fresh ingredients and lots of love!",
      features: [
        "Fresh ingredients sourced daily",
        "Hygienic preparation methods",
        "Customizable as per your taste",
        "Traditional recipes with modern twist"
      ],
      stats: [
        { label: "Daily Orders", value: "500+", icon: <FiClock /> },
        { label: "Happy Customers", value: "10K+", icon: <FiStar /> },
        { label: "Dishes Available", value: "50+", icon: <FiCheckCircle /> }
      ],
      image: "🍔🍕🥗"
    },
    service: {
      title: "⚡ Quick Table Service",
      icon: <FiUsers className="w-12 h-12" />,
      color: "from-blue-500 to-cyan-500",
      description: "Get your food served fresh on your table in minimum time!",
      features: [
        "Order from your table via QR code",
        "Real-time order tracking",
        "Friendly staff assistance",
        "Clean and hygienic tables"
      ],
      stats: [
        { label: "Avg Service Time", value: "15-20 min", icon: <FiClock /> },
        { label: "Tables Available", value: "25+", icon: <FiUsers /> },
        { label: "Staff Members", value: "15+", icon: <FiSmile /> }
      ],
      image: "🍽️👨‍🍳✨"
    },
    healthy: {
      title: "🥗 Healthy Options",
      icon: <FiHeart className="w-12 h-12" />,
      color: "from-green-500 to-emerald-500",
      description: "Nutritious meals that taste great and keep you healthy!",
      features: [
        "Calorie-counted meals",
        "Vegan & Gluten-free options",
        "Organic ingredients",
        "Dietitian approved recipes"
      ],
      stats: [
        { label: "Healthy Dishes", value: "30+", icon: <FiHeart /> },
        { label: "Calorie Range", value: "200-600", icon: <FiCheckCircle /> },
        { label: "Customer Rating", value: "4.9", icon: <FiStar /> }
      ],
      image: "🥑🥦🥗"
    }
  }

  const data = content[type]

  if (!data) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="glass-card w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className={`bg-gradient-to-r ${data.color} p-6 text-white relative`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
              >
                <FiX className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl animate-float">
                  {data.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{data.title}</h2>
                  <p className="text-white/80 mt-1">{data.description}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {data.stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-center p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Service Time Progress Bar for Quick Service */}
              {type === 'service' && (
                <motion.div 
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <h3 className="text-lg font-semibold text-white mb-3 text-center">⏱️ Estimated Service Time</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>Order Placed</span>
                        <span>0 min</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-0 bg-blue-400 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>Order Confirmed</span>
                        <span>2-3 min</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-1/6 bg-yellow-400 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>Being Prepared</span>
                        <span>5-10 min</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-orange-400 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>Ready to Serve</span>
                        <span>10-15 min</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-300 mb-1">
                        <span>Served at Your Table</span>
                        <span>15-20 min</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-blue-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm text-gray-300">
                    🎯 Total Time: 15-20 minutes from order to table
                  </div>
                </motion.div>
              )}

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">✨ Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.features.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-2 text-gray-300"
                    >
                      <FiCheckCircle className="text-green-400 w-4 h-4" />
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Decorative image */}
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-4xl tracking-wider animate-float">
                  {data.image}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {type === 'service' ? 'Get your food served fresh at your table!' : 'Experience the best of CanteenHub!'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex justify-end">
              <button
                onClick={onClose}
                className={`px-6 py-2 rounded-xl bg-gradient-to-r ${data.color} text-white font-semibold hover:scale-105 transition-all duration-300`}
              >
                Got it! 🎉
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default InfoPopup
