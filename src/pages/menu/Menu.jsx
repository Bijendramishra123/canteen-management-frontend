import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiShoppingCart, FiStar, FiImage, FiRefreshCw, FiAlertCircle, FiGrid, FiList, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useFoods } from '../../hooks/queries/useFoods'
import { addToCart } from '../../redux/slices/cartSlice'
import toast from 'react-hot-toast'

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [imgErrors, setImgErrors] = useState({})
  const [viewMode, setViewMode] = useState('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { data: foods, isLoading, refetch } = useFoods({ search: debouncedSearch })
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Categories
  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️', color: 'from-gray-400 to-gray-500' },
    { id: 'breakfast', name: 'Breakfast', icon: '🍳', color: 'from-orange-400 to-orange-500' },
    { id: 'lunch', name: 'Lunch', icon: '🍛', color: 'from-green-400 to-green-500' },
    { id: 'snacks', name: 'Snacks', icon: '🍟', color: 'from-yellow-400 to-yellow-500' },
    { id: 'beverages', name: 'Beverages', icon: '🥤', color: 'from-sky-400 to-sky-500' },
    { id: 'main', name: 'Main Course', icon: '🍕', color: 'from-red-400 to-red-500' },
  ]

  // Filter by category
  const filteredByCategory = foods?.filter(food => {
    if (selectedCategory === 'all') return true
    return food.category === selectedCategory
  }) || []

  // Pagination
  const totalPages = Math.ceil(filteredByCategory.length / itemsPerPage)
  const paginatedFoods = filteredByCategory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

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
    toast.success(`${food.name} added to cart!`, {
      icon: '🛒',
      duration: 1500
    })
  }
  
  const getImageUrl = (imagePath, foodId) => {
    if (imgErrors[foodId]) return null
    if (!imagePath) return 'https://placehold.co/400x300/87CEEB/white?text=Food+Item'
    if (imagePath.startsWith('http')) return imagePath
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  }
  
  const handleImageError = (foodId) => {
    setImgErrors(prev => ({ ...prev, [foodId]: true }))
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
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
      scale: 1.03,
      y: -8,
      transition: { type: 'spring', stiffness: 300, damping: 15 }
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="h-56 skeleton"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded skeleton w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded skeleton w-full"></div>
              <div className="flex justify-between">
                <div className="h-6 bg-gray-200 rounded skeleton w-20"></div>
                <div className="h-8 bg-gray-200 rounded skeleton w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="text-center">
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
        >
          Our Special Menu
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 text-lg max-w-2xl mx-auto"
        >
          Discover our delicious selection of freshly prepared meals made with love
        </motion.p>
      </div>
      
      {/* Search and Filter Bar */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="sticky top-20 z-20 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for delicious food..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
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
                <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {/* View Toggle */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-white shadow-md text-sky-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-white shadow-md text-sky-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <FiList className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="flex overflow-x-auto gap-2 mt-4 pb-2 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </motion.div>
      
      {/* Results Count */}
      {debouncedSearch && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-gray-500"
        >
          Found {filteredByCategory.length} result(s) for "{debouncedSearch}"
        </motion.div>
      )}
      
      {/* Menu Grid/List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }
      >
        <AnimatePresence>
          {paginatedFoods.length > 0 ? (
            paginatedFoods.map((food, index) => (
              <motion.div
                key={food.id || food._id}
                variants={itemVariants}
                whileHover="hover"
                layout
                className={`bg-white rounded-2xl shadow-lg overflow-hidden group ${!food.availability ? 'opacity-75' : ''} ${
                  viewMode === 'list' ? 'flex flex-row items-center gap-4 p-4' : ''
                }`}
              >
                {/* Image Container */}
                <div className={`relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ${
                  viewMode === 'grid' ? 'h-56' : 'w-32 h-32 rounded-xl flex-shrink-0'
                }`}>
                  <img 
                    src={getImageUrl(food.image, food.id)}
                    alt={food.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => handleImageError(food.id)}
                    loading="lazy"
                  />
                  
                  {/* Availability Badge */}
                  <div className="absolute top-3 left-3">
                    {food.availability ? (
                      <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg animate-pulse">
                        Available
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium shadow-lg flex items-center gap-1">
                        <FiAlertCircle className="w-3 h-3" /> Out of Stock
                      </span>
                    )}
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                    <FiStar className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs font-semibold">4.5</span>
                  </div>
                  
                  {/* Hover Overlay */}
                  {food.availability && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => handleAddToCart(food)}
                        className="bg-white text-sky-600 px-4 py-2 rounded-full font-semibold flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-all duration-300 hover:shadow-xl"
                      >
                        <FiShoppingCart /> Add to Cart
                      </button>
                    </div>
                  )}
                  
                  {/* Unavailable Overlay */}
                  {!food.availability && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                        <FiAlertCircle /> Unavailable
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className={`flex-1 ${viewMode === 'grid' ? 'p-4' : 'p-0'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-lg font-bold ${!food.availability ? 'text-gray-500' : 'text-gray-800'} line-clamp-1`}>
                      {food.name}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{food.description || 'Delicious food item prepared with fresh ingredients'}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className={`text-2xl font-bold ${!food.availability ? 'text-gray-400' : 'text-sky-600'}`}>
                        ₹{food.price}
                      </span>
                      {viewMode === 'list' && (
                        <p className="text-xs text-gray-400 mt-1">per serving</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(food)}
                      disabled={!food.availability}
                      className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-sm ${
                        food.availability 
                          ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:shadow-lg hover:scale-105' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <FiShoppingCart className="w-4 h-4" /> 
                      {food.availability ? 'Add' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiSearch className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No food items found</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filter</p>
              <button 
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  refetch()
                }}
                className="mt-4 text-sky-500 hover:text-sky-600 flex items-center gap-2 mx-auto"
              >
                <FiRefreshCw /> Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-center gap-2 mt-8"
        >
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-all"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-all"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  )
}

export default Menu
