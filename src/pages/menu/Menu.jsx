import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiShoppingCart, FiStar, FiImage, FiRefreshCw, FiAlertCircle, FiGrid, FiList } from 'react-icons/fi'
import { useFoods } from '../../hooks/queries/useFoods'
import { addToCart } from '../../redux/slices/cartSlice'
import toast from 'react-hot-toast'

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [imgErrors, setImgErrors] = useState({})
  const [viewMode, setViewMode] = useState('grid')
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { data: foods, isLoading, refetch } = useFoods({ search: debouncedSearch })
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])
  
  const handleAddToCart = (food) => {
    if (!food.availability) {
      toast.error(`${food.name} is currently unavailable!`)
      return
    }
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }
    dispatch(addToCart(food))
    toast.success(`${food.name} added to cart!`)
  }
  
  const getImageUrl = (imagePath, foodId) => {
    if (imgErrors[foodId]) return null
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  }
  
  const handleImageError = (foodId, imagePath) => {
    console.log(`Image failed to load: ${imagePath} for food ${foodId}`)
    setImgErrors(prev => ({ ...prev, [foodId]: true }))
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 12 }
    },
    hover: {
      scale: 1.02,
      y: -8,
      transition: { type: 'spring', stiffness: 300, damping: 15 }
    }
  }
  
  if (isLoading && debouncedSearch === searchTerm) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="h-56 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
              <div className="flex justify-between">
                <div className="h-7 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="h-9 bg-gray-200 rounded animate-pulse w-28"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Our Menu
        </h1>
        <p className="text-gray-600 text-lg">Discover our delicious selection of freshly prepared meals</p>
      </motion.div>
      
      {/* Search and View Controls */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}
          {searchTerm !== debouncedSearch && (
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        {/* View Toggle */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FiList className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
      
      {/* Results Count */}
      {debouncedSearch && (
        <motion.div variants={itemVariants} className="text-center text-sm text-gray-500">
          Found {foods?.length || 0} result(s) for "{debouncedSearch}"
        </motion.div>
      )}
      
      {/* Menu Grid/List */}
      <motion.div variants={containerVariants} className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
        <AnimatePresence>
          {foods && foods.length > 0 ? (
            foods.map((food, index) => (
              <motion.div
                key={food.id}
                variants={itemVariants}
                whileHover="hover"
                layout
                className={`bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group ${!food.availability ? 'opacity-75' : ''} ${
                  viewMode === 'list' ? 'flex flex-row items-center gap-4 p-4' : ''
                }`}
              >
                {/* Image Container - FIXED */}
                <div className={`relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ${
                  viewMode === 'grid' ? 'h-56' : 'w-32 h-32 rounded-xl flex-shrink-0'
                }`}>
                  {getImageUrl(food.image, food.id) ? (
                    <motion.img 
                      src={getImageUrl(food.image, food.id)}
                      alt={food.name}
                      className="w-full h-full object-cover object-center"
                      initial={{ scale: 1 }}
                      whileHover={{ scale: food.availability ? 1.1 : 1 }}
                      transition={{ duration: 0.3 }}
                      onError={() => handleImageError(food.id, food.image)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <FiImage className="w-12 h-12 mb-2 opacity-50" />
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                  
                  {/* Availability Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {food.availability ? (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg"
                      >
                        Available
                      </motion.span>
                    ) : (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg flex items-center gap-1"
                      >
                        <FiAlertCircle className="w-3 h-3" /> Out of Stock
                      </motion.span>
                    )}
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                    <FiStar className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-semibold">4.5</span>
                  </div>
                  
                  {/* Hover Overlay for Add to Cart */}
                  {food.availability && (
                    <motion.div 
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(food)}
                        className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-all duration-300"
                      >
                        <FiShoppingCart /> Add to Cart
                      </motion.button>
                    </motion.div>
                  )}
                  
                  {/* Unavailable Overlay */}
                  {!food.availability && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="bg-red-500 text-white px-3 py-1.5 rounded-full font-semibold flex items-center gap-2 text-sm">
                        <FiAlertCircle /> Currently Unavailable
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className={`flex-1 ${viewMode === 'grid' ? 'p-4' : 'p-0'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-lg font-bold ${!food.availability ? 'text-gray-500' : 'text-gray-800'}`}>
                      {food.name}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{food.description || 'Delicious food item'}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <motion.span 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`text-2xl font-bold ${!food.availability ? 'text-gray-400' : 'text-blue-600'}`}
                      >
                        ₹{food.price}
                      </motion.span>
                    </div>
                    <motion.button
                      whileTap={{ scale: food.availability ? 0.95 : 1 }}
                      onClick={() => handleAddToCart(food)}
                      disabled={!food.availability}
                      className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-sm ${
                        food.availability 
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <FiShoppingCart className="w-4 h-4" /> 
                      {food.availability ? 'Add to Cart' : 'Unavailable'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants} className="col-span-3 text-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              </motion.div>
              <p className="text-gray-500 text-lg">No food items found</p>
              <p className="text-gray-400 text-sm mt-2">Try searching for something else</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm('')
                  setDebouncedSearch('')
                }}
                className="mt-4 text-blue-500 hover:text-blue-600 flex items-center gap-2 mx-auto"
              >
                <FiRefreshCw /> Clear Search
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default Menu
