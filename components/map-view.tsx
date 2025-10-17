'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Restaurant } from '@/types/restaurant'
import { LoadingSpinner } from './loading-spinner'

interface Location {
  lat: number
  lng: number
  address: string
}

interface MapViewProps {
  restaurants: Restaurant[]
  location: Location | null
  loading: boolean
}

export function MapView({ restaurants, location, loading }: MapViewProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading || !mapLoaded) {
    return (
      <div className="py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (!location) {
    return (
      <div className="py-12 text-center">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Map View Unavailable
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Location access is required to show the map view.
        </p>
      </div>
    )
  }

  return (
    <section className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Restaurants on Map
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found
        </p>
      </motion.div>

      {/* Map Container */}
      <div className="relative h-96 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
        {/* Mock Map - In production, this would be a real map component */}
        <div className="w-full h-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 relative">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E')]"></div>
          </div>

          {/* User Location */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            className="absolute w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></div>
          </motion.div>

          {/* Restaurant Markers */}
          {restaurants.map((restaurant, index) => {
            const angle = (index * 360) / restaurants.length
            const radius = 80
            const x = 50 + (radius * Math.cos(angle * Math.PI / 180))
            const y = 50 + (radius * Math.sin(angle * Math.PI / 180))

            return (
              <motion.div
                key={restaurant.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="absolute w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={restaurant.name}
              >
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                  🍽️
                </div>
              </motion.div>
            )
          })}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
              <span className="text-lg">+</span>
            </button>
            <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
              <span className="text-lg">−</span>
            </button>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <span className="text-gray-700">Your Location</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">Restaurants</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Overlay Info */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
          <h4 className="font-semibold text-gray-900 mb-2">Map View</h4>
          <p className="text-sm text-gray-600">
            Interactive map showing {restaurants.length} restaurants near your location. 
            Click on markers to view details.
          </p>
        </div>
      </div>

      {/* Restaurant List */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Restaurants on Map
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.slice(0, 6).map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  🍽️
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {restaurant.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {restaurant.cuisine} • {restaurant.rating} ⭐
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}