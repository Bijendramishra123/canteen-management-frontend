import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGift, FiCalendar, FiUpload, FiCheckCircle, FiAlertCircle, FiLoader, FiEye } from 'react-icons/fi'
import toast from 'react-hot-toast'

const BirthdayRequest = ({ user, onClose, onRequestSubmitted }) => {
  const [step, setStep] = useState(1)
  const [birthDate, setBirthDate] = useState('')
  const [aadharNumber, setAadharNumber] = useState('')
  const [aadharPhoto, setAadharPhoto] = useState(null)
  const [aadharPreview, setAadharPreview] = useState(null)
  const [digilockerPhoto, setDigilockerPhoto] = useState(null)
  const [digilockerPreview, setDigilockerPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const today = new Date()
  const currentYear = today.getFullYear()

  const checkBirthday = () => {
    if (!birthDate) return false
    const birth = new Date(birthDate)
    const isBirthdayToday = birth.getDate() === today.getDate() && birth.getMonth() === today.getMonth()
    const age = currentYear - birth.getFullYear()
    return { isBirthdayToday, age }
  }

  // Check if Aadhar already used in last 365 days
  const isAadharAlreadyUsed = (aadhar) => {
    const approvedUsers = JSON.parse(localStorage.getItem('approved_birthday_users') || '[]')
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    
    const existing = approvedUsers.find(u => u.aadhar_number === aadhar)
    if (existing) {
      const approvedDate = new Date(existing.approved_date)
      if (approvedDate > oneYearAgo) {
        return { used: true, date: approvedDate }
      }
    }
    return { used: false }
  }

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === 'aadhar') {
          setAadharPhoto(file)
          setAadharPreview(reader.result)
        } else {
          setDigilockerPhoto(file)
          setDigilockerPreview(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitRequest = async () => {
    if (!aadharPhoto || !digilockerPhoto) {
      toast.error('Please upload both Aadhar card photo and Digilocker screenshot')
      return
    }

    // Check if Aadhar already used
    const aadharCheck = isAadharAlreadyUsed(aadharNumber)
    if (aadharCheck.used) {
      toast.error(`This Aadhar number was already used on ${new Date(aadharCheck.date).toLocaleDateString()}. Can only be used once per year.`)
      return
    }

    setIsSubmitting(true)

    const aadharBase64 = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(aadharPhoto)
    })

    const digilockerBase64 = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(digilockerPhoto)
    })

    const requestData = {
      id: Date.now().toString(),
      user_id: user?.id,
      user_name: user?.name,
      user_email: user?.email,
      birth_date: birthDate,
      aadhar_number: aadharNumber,
      aadhar_photo: aadharBase64,
      digilocker_screenshot: digilockerBase64,
      status: 'pending',
      request_date: new Date().toISOString()
    }

    try {
      const existingRequests = JSON.parse(localStorage.getItem('birthday_requests') || '[]')
      const filtered = existingRequests.filter(r => r.user_id !== user?.id || r.status !== 'pending')
      filtered.push(requestData)
      localStorage.setItem('birthday_requests', JSON.stringify(filtered))
      
      toast.success('Birthday verification request submitted! Admin will verify soon.')
      onRequestSubmitted && onRequestSubmitted()
      setTimeout(() => onClose(), 2000)
    } catch (error) {
      toast.error('Failed to submit request')
    } finally {
      setIsSubmitting(false)
    }
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
        className="glass-card w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-6 text-white sticky top-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl animate-float">
              <FiGift className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Birthday Offer Request</h2>
              <p className="text-white/80 mt-1">Get 50% OFF on your birthday!</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between mb-8">
            {[
              { step: 1, label: 'Birth Date', icon: FiCalendar },
              { step: 2, label: 'Upload Documents', icon: FiUpload },
              { step: 3, label: 'Submit Request', icon: FiCheckCircle }
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
                          ? "Great! Today is your birthday! Continue to upload documents."
                          : `Your birthday is on ${new Date(birthDate).toLocaleDateString()}. You can still apply, offer will be valid on your birthday.`}
                      </span>
                    </div>
                    {age && age < 18 && (
                      <p className="text-xs text-red-500 mt-1">You must be 18+ to claim this offer</p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => birthDate && age >= 18 ? setStep(2) : toast.error('Please enter valid birth date (18+ only)')}
                  disabled={!birthDate || age < 18}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Continue to Upload →
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <FiUpload className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold">Upload Verification Documents</h3>
                  <p className="text-gray-500 text-sm">Upload Aadhar card and Digilocker screenshot</p>
                  <p className="text-xs text-red-500 mt-1">Note: Same Aadhar can only be used once per year</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                    <input
                      type="text"
                      placeholder="Enter 12-digit Aadhar Number"
                      value={aadharNumber}
                      onChange={(e) => setAadharNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      maxLength={12}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Card Photo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'aadhar')}
                        className="hidden"
                        id="aadhar-upload"
                      />
                      <label htmlFor="aadhar-upload" className="cursor-pointer block">
                        {aadharPreview ? (
                          <img src={aadharPreview} alt="Aadhar" className="max-h-32 mx-auto rounded" />
                        ) : (
                          <div>
                            <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Click to upload Aadhar card photo</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Digilocker Screenshot</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'digilocker')}
                        className="hidden"
                        id="digilocker-upload"
                      />
                      <label htmlFor="digilocker-upload" className="cursor-pointer block">
                        {digilockerPreview ? (
                          <img src={digilockerPreview} alt="Digilocker" className="max-h-32 mx-auto rounded" />
                        ) : (
                          <div>
                            <FiEye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Click to upload Digilocker screenshot</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(3)}
                  disabled={!aadharNumber || !aadharPhoto || !digilockerPhoto}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  Review & Submit →
                </button>
              </motion.div>
            )}

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
                    <FiGift className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Request Summary</h3>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><strong>Birth Date:</strong> {new Date(birthDate).toLocaleDateString()}</p>
                  <p><strong>Aadhar Number:</strong> {aadharNumber.replace(/(\d{4})/g, '$1 ')}</p>
                  <p><strong>Documents:</strong> Both uploaded</p>
                </div>

                <button
                  onClick={handleSubmitRequest}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-5 h-5" />
                      Submit Verification Request
                    </>
                  )}
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

export default BirthdayRequest
