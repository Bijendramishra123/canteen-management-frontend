import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Floating Food Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 text-4xl animate-float opacity-10">🍔</div>
        <div className="absolute top-40 right-20 text-5xl animate-float opacity-10" style={{animationDelay: '1s'}}>🍕</div>
        <div className="absolute bottom-32 left-20 text-4xl animate-float opacity-10" style={{animationDelay: '2s'}}>🥗</div>
        <div className="absolute top-1/2 right-10 text-3xl animate-float opacity-10" style={{animationDelay: '1.5s'}}>🍜</div>
        <div className="absolute bottom-20 right-40 text-3xl animate-float opacity-10" style={{animationDelay: '0.5s'}}>🍝</div>
        <div className="absolute top-60 left-40 text-3xl animate-float opacity-10" style={{animationDelay: '2.5s'}}>🍛</div>
      </div>
      
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
