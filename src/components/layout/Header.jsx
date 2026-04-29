import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FiShoppingCart, FiUser, FiLogOut, FiChevronDown, FiHome, FiMenu, FiPackage, FiGrid, FiX } from 'react-icons/fi'
import { logout } from '../../redux/slices/authSlice'
import toast from 'react-hot-toast'

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { totalItems } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-btn')) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully!')
    setIsDropdownOpen(false)
    setIsMobileMenuOpen(false)
    navigate('/login')
  }

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const navLinks = [
    { to: '/', icon: FiHome, label: 'Home' },
    { to: '/menu', icon: FiMenu, label: 'Menu' },
  ]

  const authLinks = isAuthenticated && user?.role === 'admin'
    ? [...navLinks, { to: '/admin', icon: FiGrid, label: 'Admin Dashboard' }]
    : isAuthenticated && user?.role === 'user'
    ? [...navLinks, { to: '/orders', icon: FiPackage, label: 'My Orders' }]
    : navLinks

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-sky-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-red-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            🍽️ CanteenHub
          </Link>
          
          {/* Desktop Navigation with Animation */}
          <nav className="hidden md:flex items-center space-x-8">
            {authLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="nav-link text-gray-700 hover:text-sky-600 transition-all duration-300 flex items-center gap-1 text-base font-medium"
              >
                <link.icon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            {isAuthenticated && (
              <Link to="/cart" className="relative group" onClick={() => setIsMobileMenuOpen(false)}>
                <FiShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-sky-600 transition-all duration-300 group-hover:scale-110" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            
            {/* User Profile Dropdown */}
            {isAuthenticated ? (
              <div className="hidden md:block relative" ref={dropdownRef}>
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 text-gray-700 hover:text-sky-600 transition-all duration-300 hover:scale-105 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-sky-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-medium">{user?.name?.split(' ')[0] || 'User'}</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-sky-100 overflow-hidden z-50 animate-fade-in">
                    <div className="px-4 py-3 bg-gradient-to-r from-sky-50 to-red-50 border-b border-sky-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-sky-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-sky-100 text-sky-700 text-xs rounded-full capitalize">
                            {user?.role}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FiUser className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                      
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiGrid className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      
                      {user?.role === 'user' && (
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FiPackage className="w-4 h-4" />
                          <span>My Orders</span>
                        </Link>
                      )}
                      
                      <hr className="my-1" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login" className="text-gray-700 hover:text-sky-600 transition-all duration-300 hover:scale-105">Login</Link>
                <Link to="/register" className="bg-gradient-to-r from-sky-500 to-sky-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300">Sign Up</Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-sky-50 transition-colors mobile-menu-btn"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div ref={mobileMenuRef} className="md:hidden mt-4 pt-4 border-t border-sky-100 animate-fade-in">
            <nav className="flex flex-col space-y-3">
              {authLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" /> {link.label}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <div className="border-t border-sky-100 pt-3 mt-2">
                  <div className="px-4 py-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-sky-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-sky-100 text-sky-700 text-xs rounded-full capitalize">{user?.role}</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-sky-50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    <FiUser className="w-5 h-5" /> My Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <FiLogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to="/login" className="flex items-center justify-center gap-2 px-4 py-3 text-gray-700 hover:bg-sky-50 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-lg hover:shadow-lg transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
