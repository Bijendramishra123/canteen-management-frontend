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
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`sticky top-0 bg-gradient-to-r ${data.color} p-5 text-white rounded-t-2xl z-10`}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
              >
                <FiX className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 pr-8">
                <div className="p-2 bg-white/20 rounded-xl">
                  {data.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{data.title}</h2>
                  <p className="text-white/80 text-sm mt-0.5">{data.description}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 bg-white">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {data.stats.map((stat, idx) => (
                  <div key={idx} className="text-center p-2 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="text-2xl mb-0.5">{stat.icon}</div>
                    <div className="text-lg font-bold text-gray-800">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Key Features Heading */}
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-sky-500 rounded-full"></span>
                Key Features
              </h3>

              {/* Features */}
              <div className="grid grid-cols-1 gap-2 mb-5">
                {data.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-gray-700">
                    <FiCheckCircle className="text-green-500 w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Service Time Progress Bar (only for service type) */}
              {type === 'service' && (
                <div className="mb-5 p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2 text-center">⏱️ Estimated Service Time</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                        <span>Order Placed</span>
                        <span>0 min</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-0 bg-blue-400 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                        <span>Order Confirmed</span>
                        <span>2-3 min</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-1/6 bg-yellow-400 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                        <span>Being Prepared</span>
                        <span>5-10 min</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-orange-400 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                        <span>Ready to Serve</span>
                        <span>10-15 min</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                        <span>Served at Your Table</span>
                        <span>15-20 min</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-blue-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-center text-xs font-medium text-blue-600">
                    🎯 Total Time: 15-20 minutes
                  </div>
                </div>
              )}

              {/* Decorative image */}
              <div className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="text-3xl tracking-wider">
                  {data.image}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {type === 'service' ? 'Get your food served fresh at your table!' : 'Experience the best of CanteenHub!'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 rounded-b-2xl">
              <button
                onClick={onClose}
                className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${data.color} text-white font-semibold hover:opacity-90 transition-all duration-300 shadow-md`}
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
