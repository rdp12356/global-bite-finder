'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { CuisineSection } from '@/components/cuisine-section'
import { RestaurantGrid } from '@/components/restaurant-grid'
import { MapView } from '@/components/map-view'
import { ForYouSection } from '@/components/for-you-section'
import { Footer } from '@/components/footer'
import { LoadingSpinner } from '@/components/loading-spinner'
import { useLocation } from '@/hooks/use-location'
import { useRestaurants } from '@/hooks/use-restaurants'

export default function Home() {
  const [view, setView] = useState<'grid' | 'map'>('grid')
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null)
  const { location, loading: locationLoading, error: locationError } = useLocation()
  const { restaurants, loading: restaurantsLoading, error: restaurantsError } = useRestaurants(location, selectedCuisine)

  if (locationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Location Access Required</h2>
          <p className="text-gray-600 mb-6">Please enable location access to discover restaurants near you.</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header onViewChange={setView} currentView={view} />
      
      <main className="relative">
        <Hero location={location} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-8"
        >
          <CuisineSection 
            onCuisineSelect={setSelectedCuisine}
            selectedCuisine={selectedCuisine}
          />
          
          <ForYouSection />
          
          {view === 'grid' ? (
            <RestaurantGrid 
              restaurants={restaurants}
              loading={restaurantsLoading}
              error={restaurantsError}
              selectedCuisine={selectedCuisine}
            />
          ) : (
            <MapView 
              restaurants={restaurants}
              location={location}
              loading={restaurantsLoading}
            />
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  )
}