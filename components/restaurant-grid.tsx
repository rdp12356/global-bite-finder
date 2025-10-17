'use client'

import { motion } from 'framer-motion'
import { Restaurant } from '@/types/restaurant'
import { RestaurantCard } from './restaurant-card'
import { LoadingSpinner } from './loading-spinner'

interface RestaurantGridProps {
  restaurants: Restaurant[]
  loading: boolean
  error: string | null
  selectedCuisine: string | null
}

export function RestaurantGrid({ restaurants, loading, error, selectedCuisine }: RestaurantGridProps) {
  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
        <p className="text-gray-600 dark:text-gray-400">
          We're having trouble loading restaurants. Please try again later.
        </p>
      </div>
    )
  }

  if (restaurants.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No restaurants found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {selectedCuisine 
            ? `No ${selectedCuisine} restaurants found in your area.`
            : 'No restaurants found in your area. Try expanding your search.'
          }
        </p>
        <button className="btn-primary">
          Clear Filters
        </button>
      </div>
    )
  }

  return (
    <section className="py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {selectedCuisine ? `${selectedCuisine} Restaurants` : 'Restaurants Near You'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant, index) => (
          <motion.div
            key={restaurant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <RestaurantCard restaurant={restaurant} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}