import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiGrid, FiList, 
  FiCheckCircle, FiXCircle, FiRefreshCw, FiFilter, 
  FiChevronLeft, FiChevronRight, FiUpload, FiX,
  FiAlertCircle, FiStar, FiEye, FiEyeOff
} from 'react-icons/fi'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = 'https://canteen-management-backend-vj7n.onrender.com/api'

const ManageFoods = () => {
  const [foods, setFoods] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingFood, setEditingFood] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    availability: true
  })
  const [imagePreview, setImagePreview] = useState(null)
  
  const itemsPerPage = 12

  // Categories
  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️', color: 'from-gray-400 to-gray-500' },
    { id: 'breakfast', name: 'Breakfast', icon: '🍳', color: 'from-orange-400 to-orange-500' },
    { id: 'lunch', name: 'Lunch', icon: '🍛', color: 'from-green-400 to-green-500' },
    { id: 'snacks', name: 'Snacks', icon: '🍟', color: 'from-yellow-400 to-yellow-500' },
    { id: 'beverages', name: 'Beverages', icon: '🥤', color: 'from-sky-400 to-sky-500' },
    { id: 'main', name: 'Main Course', icon: '🍕', color: 'from-red-400 to-red-500' },
  ]

  // Fetch foods
  const fetchFoods = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      const response = await axios.get(`${API_URL}/foods`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('Fetched foods:', response.data)
      setFoods(response.data)
    } catch (error) {
      console.error('Error fetching foods:', error)
      toast.error('Failed to load foods')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFoods()
  }, [])

  const toggleAvailability = async (foodId, currentStatus) => {
    try {
      const token = localStorage.getItem('access_token')
      await axios.patch(`${API_URL}/foods/${foodId}/availability`, 
        { availability: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(`Item ${!currentStatus ? 'available' : 'unavailable'} now`)
      fetchFoods()
    } catch (error) {
      toast.error('Failed to update availability')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const priceNum = parseFloat(formData.price)
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price')
      return
    }
    
    const foodData = {
      name: formData.name,
      price: priceNum,
      category: formData.category,
      description: formData.description || '',
      image: formData.image || '',
      availability: formData.availability
    }
    
    try {
      const token = localStorage.getItem('access_token')
      
      if (editingFood) {
        await axios.put(`${API_URL}/foods/${editingFood.id}`, foodData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Food item updated successfully!')
      } else {
        await axios.post(`${API_URL}/foods`, foodData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        toast.success('Food item added successfully!')
      }
      
      setShowForm(false)
      setEditingFood(null)
      setFormData({ name: '', price: '', category: '', description: '', image: '', availability: true })
      setImagePreview(null)
      fetchFoods()
    } catch (error) {
      toast.error(editingFood ? 'Failed to update' : 'Failed to add')
    }
  }

  const handleDelete = async (food) => {
    if (!window.confirm(`Are you sure you want to delete "${food.name}"?`)) return
    try {
      const token = localStorage.getItem('access_token')
      await axios.delete(`${API_URL}/foods/${food.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Food deleted successfully')
      fetchFoods()
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const handleEdit = (food) => {
    setEditingFood(food)
    setFormData({
      name: food.name,
      price: food.price,
      category: food.category,
      description: food.description || '',
      image: food.image || '',
      availability: food.availability
    })
    setImagePreview(food.image)
    setShowForm(true)
  }

  const handleImageUrlChange = (url) => {
    setFormData({ ...formData, image: url })
    if (url && (url.startsWith('http') || url.startsWith('/'))) {
      setImagePreview(url)
    } else {
      setImagePreview(null)
    }
  }

  // Filter foods
  const filteredFoods = foods.filter(food => {
    const matchesSearch = searchTerm === '' || 
      food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (food.description && food.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage)
  const paginatedFoods = filteredFoods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading food items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
            Manage Food Items
          </h1>
          <p className="text-gray-500 mt-1">Total {foods.length} items in your menu</p>
        </div>
        <button
          onClick={() => {
            setEditingFood(null)
            setFormData({ name: '', price: '', category: '', description: '', image: '', availability: true })
            setImagePreview(null)
            setShowForm(true)
          }}
          className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all hover:scale-105"
        >
          <FiPlus className="w-5 h-5" /> Add New Food Item
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-20 z-20 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-sky-600' : 'text-gray-500'}`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-sky-600' : 'text-gray-500'}`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={() => fetchFoods()}
              className="p-2 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-all"
            >
              <FiRefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="flex overflow-x-auto gap-2 mt-4 pb-2">
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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.filter(c => c.id !== 'all').map((cat) => {
          const count = foods.filter(f => f.category === cat.id).length
          return (
            <div key={cat.id} className={`bg-gradient-to-r ${cat.color} rounded-xl p-4 text-white shadow-lg`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">{cat.name}</p>
                  <p className="text-2xl font-bold">{count}</p>
                </div>
                <span className="text-3xl">{cat.icon}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className="text-center text-sm text-gray-500">
          Found {filteredFoods.length} result(s) for "{searchTerm}"
        </div>
      )}

      {/* Food Items Grid/List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
        }
      >
        <AnimatePresence>
          {paginatedFoods.length > 0 ? (
            paginatedFoods.map((food) => (
              <motion.div
                key={food.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden group ${
                  viewMode === 'list' ? 'flex flex-row items-center gap-4 p-4' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 ${
                  viewMode === 'grid' ? 'h-48' : 'w-28 h-28 rounded-xl flex-shrink-0'
                }`}>
                  <img
                    src={food.image && (food.image.startsWith('http') || food.image.startsWith('/')) ? food.image : 'https://placehold.co/400x300/87CEEB/white?text=No+Image'}
                    alt={food.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://placehold.co/400x300/87CEEB/white?text=No+Image' }}
                  />
                  <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                    food.availability ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {food.availability ? 'Available' : 'Out of Stock'}
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 ${viewMode === 'grid' ? 'p-4' : 'p-0'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 line-clamp-1">{food.name}</h3>
                      <p className="text-xs text-gray-400 capitalize mt-0.5">{food.category}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FiStar className="w-3 h-3 fill-current" />
                      <span className="text-xs font-semibold">4.5</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{food.description || 'No description'}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xl font-bold text-sky-600">₹{food.price}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(food)}
                        className="p-2 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-all"
                        title="Edit"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(food)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiSearch className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No food items found</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="mt-4 text-sky-500 hover:text-sky-600"
              >
                Clear Filters
              </button>
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page = i + 1
              if (totalPages > 5 && currentPage > 3) {
                page = currentPage - 2 + i
                if (page > totalPages) return null
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-50 hover:bg-gray-200"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className={`bg-gradient-to-r ${editingFood ? 'from-amber-500 to-orange-500' : 'from-sky-500 to-sky-600'} p-6 text-white sticky top-0`}>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">
                    {editingFood ? 'Edit Food Item' : 'Add New Food Item'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-white/80 mt-1">
                  {editingFood ? 'Update the details below' : 'Fill in the details to add a new item'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                    placeholder="e.g., Margherita Pizza"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400"
                      placeholder="e.g., 299"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="">Select Category</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="snacks">Snacks</option>
                      <option value="beverages">Beverages</option>
                      <option value="main">Main Course</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400"
                    placeholder="https://example.com/image.jpg or /image.jpg"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-400"
                    placeholder="Describe the food item..."
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availability}
                      onChange={(e) => setFormData({...formData, availability: e.target.checked})}
                      className="w-5 h-5 rounded border-gray-300 text-sky-500 focus:ring-sky-400"
                    />
                    <span className="text-gray-700">Item is available for ordering</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-sky-500 to-sky-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    {editingFood ? 'Update Item' : 'Add Item'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageFoods
