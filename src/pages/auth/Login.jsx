import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import CanteenLogo from '../../components/ui/CanteenLogo'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    login({ email, password })
  }

  const handleForgotPassword = () => {
    if (!resetEmail) {
      alert('Please enter your email address')
      return
    }
    alert(`Password reset link sent to ${resetEmail}`)
    setShowForgotPassword(false)
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring' } }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Animated Background */}
      <div className="animated-bg"></div>
      
      {/* Food items floating background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-30">🍔</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-float opacity-30" style={{animationDelay: '1s'}}>🍕</div>
        <div className="absolute top-40 right-20 text-5xl animate-float opacity-30" style={{animationDelay: '2s'}}>🥗</div>
        <div className="absolute bottom-40 left-20 text-5xl animate-float opacity-30" style={{animationDelay: '1.5s'}}>🍜</div>
        <div className="absolute top-1/2 left-5 text-4xl animate-float opacity-20" style={{animationDelay: '0.5s'}}>🥘</div>
        <div className="absolute top-1/3 right-5 text-4xl animate-float opacity-20" style={{animationDelay: '2.5s'}}>🍣</div>
        <div className="absolute top-10 right-20 text-4xl animate-float opacity-25" style={{animationDelay: '3s'}}>🍝</div>
        <div className="absolute bottom-10 left-20 text-4xl animate-float opacity-25" style={{animationDelay: '1.8s'}}>🍛</div>
      </div>

      {/* Main Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <CanteenLogo className="w-24 h-24" />
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-dark mb-2">Welcome Back</h2>
          <p className="text-muted">Sign in to continue to CanteenHub</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/90 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white/90 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-sky-500 focus:ring-sky-400" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-sky-500 hover:text-sky-600 transition"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 animate-pulse-glow"
          >
            <FiLogIn className="w-5 h-5" />
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social Login - Facebook instead of GitHub */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-300">
            <FcGoogle className="w-5 h-5" />
            Google
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 bg-[#1877F2] border border-[#1877F2] rounded-xl text-white hover:bg-[#166FE5] hover:shadow-md transition-all duration-300">
            <FaFacebook className="w-5 h-5" />
            Facebook
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-500 hover:text-sky-600 font-semibold transition">
            Sign Up
          </Link>
        </p>
      </motion.div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-md p-6"
          >
            <h3 className="text-2xl font-bold text-dark mb-4">Reset Password</h3>
            <p className="text-muted mb-4">Enter your email to receive a password reset link</p>
            <input
              type="email"
              placeholder="Email Address"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/90 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleForgotPassword}
                className="flex-1 bg-sky-500 text-white py-2 rounded-xl hover:bg-sky-600 transition"
              >
                Send Reset Link
              </button>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Login
