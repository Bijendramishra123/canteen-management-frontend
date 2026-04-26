import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiCoffee, FiTruck, FiHeart } from 'react-icons/fi'

const Home = () => {
  const features = [
    { icon: FiCoffee, title: 'Delicious Food', description: 'Freshly prepared meals made with love' },
    { icon: FiTruck, title: 'Fast Delivery', description: 'Quick delivery to your doorstep' },
    { icon: FiHeart, title: 'Healthy Options', description: 'Nutritious meals for everyone' },
  ]
  
  return (
    <div className="space-y-16">
      <section className="text-center py-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to Canteen Hub</h1>
        <p className="text-xl md:text-2xl mb-8">Delicious food delivered fresh to your table</p>
        <Link to="/menu" className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all">
          Order Now <FiArrowRight className="ml-2" />
        </Link>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md card-hover">
            <feature.icon className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Home
