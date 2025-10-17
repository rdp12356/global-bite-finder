'use client'

import { motion } from 'framer-motion'
import { Heart, Star, TrendingUp, Clock, Users } from 'lucide-react'
import { useAuth } from './auth-provider'

export function ForYouSection() {
  const { user } = useAuth()

  const recommendations = [
    {
      id: '1',
      title: 'Trending This Week',
      restaurants: [
        {
          name: 'Sakura Sushi Bar',
          cuisine: 'Japanese',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
          reason: 'Highly rated by users with similar taste preferences'
        },
        {
          name: 'Bella Vista Italian',
          cuisine: 'Italian',
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop',
          reason: 'Popular among Italian food lovers'
        }
      ]
    },
    {
      id: '2',
      title: 'Newly Opened',
      restaurants: [
        {
          name: 'Spice Garden',
          cuisine: 'Indian',
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop',
          reason: 'Just opened this month with authentic flavors'
        },
        {
          name: 'El Mariachi',
          cuisine: 'Mexican',
          rating: 4.6,
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop',
          reason: 'Fresh Mexican cuisine with bold flavors'
        }
      ]
    },
    {
      id: '3',
      title: 'Based on Your Preferences',
      restaurants: [
        {
          name: 'Bangkok Express',
          cuisine: 'Thai',
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1555939594-58d7cb561a1a?w=300&h=200&fit=crop',
          reason: 'Matches your love for spicy food'
        },
        {
          name: 'Le Petit Bistro',
          cuisine: 'French',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop',
          reason: 'Perfect for romantic dinners'
        }
      ]
    }
  ]

  if (!user) {
    return (
      <section className="py-12 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl mb-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-6xl mb-4"
          >
            💖
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Personalized Recommendations
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Sign in to get personalized restaurant recommendations based on your taste preferences, 
            dining history, and favorite cuisines.
          </p>
          <button className="btn-primary">
            Sign In for Recommendations
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          For You, {user.name.split(' ')[0]}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Handpicked recommendations based on your taste profile and dining preferences
        </p>
      </motion.div>

      <div className="space-y-12">
        {recommendations.map((section, sectionIndex) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: sectionIndex * 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                {sectionIndex === 0 && <TrendingUp className="w-4 h-4 text-white" />}
                {sectionIndex === 1 && <Clock className="w-4 h-4 text-white" />}
                {sectionIndex === 2 && <Heart className="w-4 h-4 text-white" />}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {section.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.restaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: sectionIndex * 0.2 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
                        {restaurant.cuisine}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-semibold text-sm">
                        {restaurant.rating}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {restaurant.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {restaurant.reason}
                    </p>
                    <div className="flex items-center justify-between">
                      <button className="btn-primary text-sm px-4 py-2">
                        View Details
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Taste Profile CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-center text-white"
      >
        <h3 className="text-2xl font-bold mb-4">Improve Your Recommendations</h3>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          Tell us more about your taste preferences to get even better restaurant suggestions
        </p>
        <button className="bg-white text-primary-600 hover:bg-gray-100 font-medium px-6 py-3 rounded-xl transition-colors duration-200">
          Update Taste Profile
        </button>
      </motion.div>
    </section>
  )
}