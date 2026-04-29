import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiUserPlus, FiEye, FiEyeOff, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import CanteenLogo from '../../components/ui/CanteenLogo'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { register, isLoading } = useAuth()

  const getPasswordStrength = () => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++
    
    if (strength === 0) return { text: 'Very Weak', color: 'bg-red-500', width: '25%' }
    if (strength === 1) return { text: 'Weak', color: 'bg-orange-500', width: '50%' }
    if (strength === 2) return { text: 'Medium', color: 'bg-yellow-500', width: '75%' }
    if (strength >= 3) return { text: 'Strong', color: 'bg-green-500', width: '100%' }
    return { text: 'Weak', color: 'bg-red-500', width: '25%' }
  }

  const passwordStrength = getPasswordStrength()
  const passwordsMatch = password === confirmPassword && password.length > 0
  const isPasswordValid = password.length >= 6

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters!')
      return
    }
    register({ name, email, password })
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring' } }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="animated-bg"></div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-float opacity-30">🍔</div>
        <div className="absolute bottom-20 right-10 text-6xl animate-float opacity-30" style={{animationDelay: '1s'}}>🍕</div>
        <div className="absolute top-40 right-20 text-5xl animate-float opacity-30" style={{animationDelay: '2s'}}>🥗</div>
        <div className="absolute bottom-40 left-20 text-5xl animate-float opacity-30" style={{animationDelay: '1.5s'}}>🍜</div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-card w-full max-w-md p-8 relative z-10"
      >
        <div className="flex justify-center mb-6">
          <CanteenLogo className="w-24 h-24" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-dark mb-2">Create Account</h2>
          <p className="text-muted">Join CanteenHub and order delicious food</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/90 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
              required
            />
          </div>

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

          {password && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Password Strength:</span>
                <span className={passwordStrength.color === 'bg-green-500' ? 'text-green-600' : passwordStrength.color === 'bg-yellow-500' ? 'text-yellow-600' : 'text-red-500'}>
                  {passwordStrength.text}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: passwordStrength.width }}></div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className={password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>✓ 8+ characters</span>
                <span className={password.match(/[A-Z]/) && password.match(/[a-z]/) ? 'text-green-600' : 'text-gray-400'}>✓ Upper & Lowercase</span>
                <span className={password.match(/[0-9]/) ? 'text-green-600' : 'text-gray-400'}>✓ Number</span>
              </div>
            </div>
          )}

          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white/90 border border-gray-200 rounded-xl text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition-all"
              required
            />
            {confirmPassword && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {passwordsMatch && isPasswordValid ? (
                  <FiCheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <FiXCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 animate-pulse-glow"
          >
            <FiUserPlus className="w-5 h-5" />
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>

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

        <p className="text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-500 hover:text-sky-600 font-semibold transition">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Register
