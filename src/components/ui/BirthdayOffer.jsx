import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGift, FiCalendar, FiPhone, FiCheckCircle, FiAlertCircle, FiPercent, FiTruck, FiCoffee } from 'react-icons/fi'
import toast from 'react-hot-toast'

const BirthdayOffer = ({ user, onApplyOffer, onClose }) => {
  const [step, setStep] = useState(1)
  const [birthDate, setBirthDate] = useState('')
  const [aadharNumber, setAadharNumber] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)

  const today = new Date()
  const currentYear = today.getFullYear()

  const checkBirthday = () => {
    if (!birthDate) return false
    const birth = new Date(birthDate)
    const isBirthdayToday = birth.getDate() === today.getDate() && birth.getMonth() === today.getMonth()
    const age = currentYear - birth.getFullYear()
    return { isBirthdayToday, age }
  }

  const handleVerifyAadhar = async () => {
    if (!aadharNumber || aadharNumber.length !== 12) {
      toast.error('Please enter valid 12-digit Aadhar number')
      return
    }

    setIsVerifying(true)
    
    // Simulate Digilocker verification
    setTimeout(() => {
      const { isBirthdayToday, age } = checkBirthday()
      
      if (isBirthdayToday && age >= 18) {
        setIsVerified(true)
        toast.success('Aadhar verified successfully! Birthday confirmed!')
        setStep(3)
      } else if (!isBirthdayToday) {
        toast.error('Sorry, this offer is only valid on your birthday!')
        setIsVerifying(false)
      } else if (age < 18) {
        toast.error('You must be 18+ to claim this offer')
        setIsVerifying(false)
      }
      setIsVerifying(false)
    }, 2000)
  }

  const handleClaimOffer = () => {
    onApplyOffer({
      discount: 50,
      type: 'birthday',
      message: 'Happy Birthday! You got 50% off on your order!'
    })
    toast.success('🎉 Happy Birthday! 50% discount applied!')
    onClose()
  }

  const { isBirthdayToday, age } = checkBirthday()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="glass-card w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl animate-float">
              <FiGift className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">🎂 Birthday Special Offer!</h2>
              <p className="text-white/80 mt-1">Get 50% OFF on your birthday!</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Steps Indicator */}
          <div className="flex justify-between mb-8">
            {[
              { step: 1, label: 'Enter Birth Date', icon: FiCalendar },
              { step: 2, label: 'Verify Aadhar', icon: FiPhone },
              { step: 3, label: 'Claim Offer', icon: FiGift }
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step >= s.step ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className={`text-xs mt-2 ${step >= s.step ? 'text-orange-500' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Enter Birth Date */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <FiCalendar className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">When's your birthday?</h3>
                  <p className="text-gray-500 text-sm">Enter your date of birth to check eligibility</p>
                </div>
                
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500"
                  max={today.toISOString().split('T')[0]}
                />
                
                {birthDate && (
                  <div className={`p-3 rounded-lg ${isBirthdayToday ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <div className="flex items-center gap-2">
                      {isBirthdayToday ? (
                        <FiCheckCircle className="text-green-500" />
                      ) : (
                        <FiAlertCircle className="text-yellow-500" />
                      )}
                      <span className="text-sm">
                        {isBirthdayToday 
                          ? "🎉 Great! Today is your birthday! Proceed to verification."
                          : `Your birthday is on ${new Date(birthDate).toLocaleDateString()}. Come back on your birthday to claim offer!`}
                      </span>
                    </div>
                    {age && age < 18 && (
                      <p className="text-xs text-red-500 mt-1">⚠️ You must be 18+ to claim this offer</p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => isBirthdayToday && age >= 18 ? setStep(2) : toast.error('Offer only valid on your birthday and for 18+')}
                  disabled={!isBirthdayToday || age < 18}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Continue to Verification →
                </button>
              </motion.div>
            )}

            {/* Step 2: Aadhar Verification */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <FiPhone className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Verify with Digilocker</h3>
                  <p className="text-gray-500 text-sm">Enter your Aadhar number for verification</p>
                </div>

                <input
                  type="text"
                  placeholder="Enter 12-digit Aadhar Number"
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  maxLength={12}
                />

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <FiCheckCircle className="w-3 h-3" />
                    Your Aadhar is verified through Digilocker. Data is encrypted and secure.
                  </p>
                </div>

                <button
                  onClick={handleVerifyAadhar}
                  disabled={isVerifying || aadharNumber.length !== 12}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </>
                  ) : (
                    'Verify with Digilocker'
                  )}
                </button>
              </motion.div>
            )}

            {/* Step 3: Claim Offer */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                    <FiPercent className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-orange-600">50% OFF!</h3>
                  <p className="text-gray-600 mt-2">Happy Birthday {user?.name}!</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                  <p className="flex items-center gap-2 text-sm">
                    <FiCheckCircle className="text-green-500" />
                    <strong>Offer Details:</strong>
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 ml-6">
                    <li>• 50% discount on your entire order</li>
                    <li>• Valid only on canteen-prepared food items</li>
                    <li>• Minimum order value: ₹1000</li>
                    <li>• Cannot be combined with other offers</li>
                    <li>• Valid only on your birthday</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-xs text-yellow-700 flex items-center gap-1">
                    <FiCoffee className="w-3 h-3" />
                    Counter verification required. Please show your verified Aadhar at the counter.
                  </p>
                </div>

                <button
                  onClick={handleClaimOffer}
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FiGift className="w-5 h-5" />
                  Claim My Birthday Offer!
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={onClose}
            className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default BirthdayOffer
