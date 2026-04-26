import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '../../api/endpoints/orders'
import { FiPackage, FiClock } from 'react-icons/fi'

const Orders = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => ordersApi.getOrders().then(res => res.data)
  })

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading orders...</div>
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-16">
        <FiPackage className="w-24 h-24 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600">No orders yet</h2>
        <p className="text-gray-500 mt-2">Start ordering some delicious food!</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">Order #{order.id}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <FiClock className="inline" /> {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                {order.status?.toUpperCase()}
              </span>
            </div>
            
            <div className="border-t border-b py-4 my-4">
              {order.items?.map((item, idx) => (
                <div key={`${order.id}-item-${idx}`} className="flex justify-between py-2">
                  <span>{item.quantity}x {item.food_name}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount</span>
              <span className="text-xl font-bold text-blue-600">₹{order.total_amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
