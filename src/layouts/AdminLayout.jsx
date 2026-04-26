import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiHome, FiMenu, FiShoppingBag, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../hooks/useAuth'

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth)
  const { logout } = useAuth()
  
  const navItems = [
    { to: '/admin', icon: FiHome, label: 'Dashboard' },
    { to: '/admin/foods', icon: FiMenu, label: 'Manage Foods' },
    { to: '/admin/orders', icon: FiShoppingBag, label: 'Manage Orders' },
  ]
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen fixed">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary-600">Admin Panel</h2>
            <p className="text-gray-600 mt-2">Welcome, {user?.name}</p>
          </div>
          
          <nav className="mt-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors
                  ${isActive ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : ''}
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            ))}
            
            <button
              onClick={logout}
              className="flex items-center px-6 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors w-full mt-8"
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </nav>
        </aside>
        
        <main className="ml-64 flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
