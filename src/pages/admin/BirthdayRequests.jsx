import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUser, FiCalendar, FiEye, FiCheckCircle, FiXCircle, FiClock, FiGift } from 'react-icons/fi'
import toast from 'react-hot-toast'

const BirthdayRequests = () => {
  const [requests, setRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = () => {
    const stored = JSON.parse(localStorage.getItem('birthday_requests') || '[]')
    setRequests(stored)
  }

  const handleApprove = (request) => {
    // Check if Aadhar already used in last year
    const approvedUsers = JSON.parse(localStorage.getItem('approved_birthday_users') || '[]')
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    
    const existing = approvedUsers.find(u => u.aadhar_number === request.aadhar_number)
    if (existing && new Date(existing.approved_date) > oneYearAgo) {
      toast.error(`This Aadhar number was already used on ${new Date(existing.approved_date).toLocaleDateString()}. Can only be used once per year.`)
      return
    }

    // Update request status
    const updated = requests.map(r => {
      if (r.id === request.id) {
        return { ...r, status: 'approved', approved_date: new Date().toISOString() }
      }
      return r
    })
    localStorage.setItem('birthday_requests', JSON.stringify(updated))
    
    // Add to approved users list with Aadhar
    const filtered = approvedUsers.filter(u => u.user_id !== request.user_id)
    filtered.push({
      user_id: request.user_id,
      user_name: request.user_name,
      user_email: request.user_email,
      birth_date: request.birth_date,
      aadhar_number: request.aadhar_number,
      approved_date: new Date().toISOString()
    })
    localStorage.setItem('approved_birthday_users', JSON.stringify(filtered))
    
    setRequests(updated)
    toast.success(`${request.user_name}'s birthday request approved! 50% OFF will be applied on their birthday.`)
    setSelectedRequest(null)
  }

  const handleReject = (request) => {
    const updated = requests.map(r => {
      if (r.id === request.id) {
        return { ...r, status: 'rejected', rejected_date: new Date().toISOString() }
      }
      return r
    })
    localStorage.setItem('birthday_requests', JSON.stringify(updated))
    setRequests(updated)
    toast.info(`${request.user_name}'s request rejected`)
    setSelectedRequest(null)
  }

  const filteredRequests = requests.filter(r => {
    if (filter === 'all') return true
    return r.status === filter
  })

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"><FiClock className="w-3 h-3" /> Pending</span>
      case 'approved':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"><FiCheckCircle className="w-3 h-3" /> Approved</span>
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center gap-1"><FiXCircle className="w-3 h-3" /> Rejected</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            Birthday Verification Requests
          </h1>
          <p className="text-gray-500 mt-1">Verify user documents and approve birthday offers</p>
        </div>
        <div className="flex gap-2">
          {['pending', 'approved', 'rejected', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg capitalize transition-all ${
                filter === f 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {filteredRequests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <FiGift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No birthday verification requests found</p>
            </div>
          ) : (
            filteredRequests.map((request, idx) => (
              <motion.div
                key={request.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {request.user_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{request.user_name}</h3>
                      <p className="text-sm text-gray-500">{request.user_email}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          Birth Date: {new Date(request.birth_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          Aadhar: {request.aadhar_number?.replace(/(\d{4})/g, '$1 ')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(request.status)}
                    <p className="text-xs text-gray-400 mt-1">
                      Requested: {new Date(request.request_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
                    >
                      <FiEye /> View Documents
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Document View Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 p-4 text-white sticky top-0">
              <h3 className="text-xl font-bold">Verify Documents</h3>
              <p className="text-white/80">Review {selectedRequest.user_name}'s verification documents</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Aadhar Card Photo</h4>
                <img src={selectedRequest.aadhar_photo} alt="Aadhar Card" className="rounded-lg border max-h-64 mx-auto" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Digilocker Screenshot</h4>
                <img src={selectedRequest.digilocker_screenshot} alt="Digilocker" className="rounded-lg border max-h-64 mx-auto" />
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-700">
                  Verify that:
                  <br />1. Name matches the user's account
                  <br />2. Birth date matches the submitted date
                  <br />3. Aadhar number is valid (12 digits)
                  <br />4. Digilocker shows the same Aadhar details
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(selectedRequest)}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                >
                  <FiCheckCircle /> Approve & Grant Offer
                </button>
                <button
                  onClick={() => handleReject(selectedRequest)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                >
                  <FiXCircle /> Reject
                </button>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default BirthdayRequests
