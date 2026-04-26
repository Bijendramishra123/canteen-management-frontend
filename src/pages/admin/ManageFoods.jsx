import React, { useState } from 'react'
import { useFoods, useCreateFood, useDeleteFood } from '../../hooks/queries/useFoods'
import { FiTrash2, FiPlus, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import axios from 'axios'

const ManageFoods = () => {
  const [showForm, setShowForm] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)
  const [newFood, setNewFood] = useState({ 
    name: '', 
    price: '', 
    description: '', 
    category: '',
    image: '',
    availability: true
  })
  const { data: foods, isLoading, refetch } = useFoods({})
  const createFood = useCreateFood()
  const deleteFood = useDeleteFood()

  const toggleAvailability = async (foodId, currentStatus) => {
    setUpdatingId(foodId)
    try {
      const response = await axios.patch(`http://localhost:8000/api/foods/${foodId}/availability`, {
        availability: !currentStatus
      })
      if (response.status === 200) {
        toast.success(`Item ${!currentStatus ? 'available' : 'unavailable'} now`)
        refetch()
      }
    } catch (error) {
      toast.error('Failed to update availability')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const priceNum = parseFloat(newFood.price)
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Please enter a valid price')
      return
    }
    
    const foodData = {
      name: newFood.name,
      price: priceNum,
      category: newFood.category || 'general',
      description: newFood.description || '',
      image: newFood.image || '',
      availability: true
    }
    
    createFood.mutate(foodData, {
      onSuccess: () => {
        setShowForm(false)
        setNewFood({ name: '', price: '', description: '', category: '', image: '', availability: true })
        refetch()
      }
    })
  }

  if (isLoading) return <div className="text-center py-8">Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Manage Food Items
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <FiPlus /> Add Food Item
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-md p-6 mb-6"
          >
            <h2 className="text-xl font-semibold mb-4">Add New Food Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Food Name *" value={newFood.name} onChange={(e) => setNewFood({ ...newFood, name: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                <input type="number" step="0.01" placeholder="Price *" value={newFood.price} onChange={(e) => setNewFood({ ...newFood, price: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
                <select value={newFood.category} onChange={(e) => setNewFood({ ...newFood, category: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Select Category</option>
                  <option value="main">Main Course</option>
                  <option value="snacks">Snacks</option>
                  <option value="beverages">Beverages</option>
                  <option value="desserts">Desserts</option>
                </select>
                <input type="text" placeholder="Image URL" value={newFood.image} onChange={(e) => setNewFood({ ...newFood, image: e.target.value })} className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <textarea placeholder="Description" value={newFood.description} onChange={(e) => setNewFood({ ...newFood, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" rows="3" />
              <div className="flex gap-3">
                <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">Save Food Item</button>
                <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {foods?.map((food) => (
              <motion.tr key={food.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium">{food.name}</td>
                <td className="px-6 py-4 text-blue-600 font-bold">₹{food.price}</td>
                <td className="px-6 py-4 capitalize">{food.category}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleAvailability(food.id, food.availability)}
                    disabled={updatingId === food.id}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      food.availability 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {updatingId === food.id ? (
                      <FiRefreshCw className="animate-spin" />
                    ) : food.availability ? (
                      <FiCheckCircle className="w-4 h-4" />
                    ) : (
                      <FiXCircle className="w-4 h-4" />
                    )}
                    {food.availability ? 'Available' : 'Unavailable'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => deleteFood.mutate(food.id)} className="text-red-500 hover:text-red-700 transition-colors">
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageFoods
