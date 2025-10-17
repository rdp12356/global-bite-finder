'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const cuisines = [
  {
    id: 'italian',
    name: 'Italian',
    emoji: '🍝',
    color: 'from-red-500 to-green-500',
    description: 'Pasta, pizza, and authentic flavors'
  },
  {
    id: 'japanese',
    name: 'Japanese',
    emoji: '🍣',
    color: 'from-red-600 to-pink-500',
    description: 'Sushi, ramen, and fresh ingredients'
  },
  {
    id: 'indian',
    name: 'Indian',
    emoji: '🍛',
    color: 'from-yellow-500 to-orange-500',
    description: 'Spices, curries, and rich flavors'
  },
  {
    id: 'mexican',
    name: 'Mexican',
    emoji: '🌮',
    color: 'from-green-500 to-yellow-500',
    description: 'Tacos, burritos, and bold tastes'
  },
  {
    id: 'thai',
    name: 'Thai',
    emoji: '🍜',
    color: 'from-red-500 to-yellow-500',
    description: 'Pad thai, curries, and aromatic spices'
  },
  {
    id: 'french',
    name: 'French',
    emoji: '🥐',
    color: 'from-blue-500 to-purple-500',
    description: 'Elegant dishes and fine dining'
  },
  {
    id: 'chinese',
    name: 'Chinese',
    emoji: '🥢',
    color: 'from-red-600 to-yellow-600',
    description: 'Dumplings, stir-fries, and diverse regions'
  },
  {
    id: 'korean',
    name: 'Korean',
    emoji: '🍲',
    color: 'from-red-500 to-blue-500',
    description: 'BBQ, kimchi, and fermented flavors'
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    emoji: '🫒',
    color: 'from-green-600 to-blue-600',
    description: 'Fresh herbs, olive oil, and healthy options'
  },
  {
    id: 'american',
    name: 'American',
    emoji: '🍔',
    color: 'from-red-500 to-blue-500',
    description: 'Burgers, BBQ, and comfort food'
  }
]

interface CuisineSectionProps {
  onCuisineSelect: (cuisine: string | null) => void
  selectedCuisine: string | null
}

export function CuisineSection({ onCuisineSelect, selectedCuisine }: CuisineSectionProps) {
  const [hoveredCuisine, setHoveredCuisine] = useState<string | null>(null)

  return (
    <section className="py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Explore International Cuisines
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover the world through food. From authentic Italian pasta to spicy Thai curries, 
          find your next favorite cuisine.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cuisines.map((cuisine, index) => (
          <motion.div
            key={cuisine.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setHoveredCuisine(cuisine.id)}
            onHoverEnd={() => setHoveredCuisine(null)}
            onClick={() => onCuisineSelect(selectedCuisine === cuisine.id ? null : cuisine.id)}
            className={`cuisine-card group cursor-pointer ${
              selectedCuisine === cuisine.id
                ? 'ring-4 ring-primary-500 ring-opacity-50'
                : ''
            }`}
          >
            <div className={`relative h-32 bg-gradient-to-br ${cuisine.color} p-4 flex flex-col items-center justify-center text-white`}>
              <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                {cuisine.emoji}
              </div>
              <h3 className="font-semibold text-sm text-center">{cuisine.name}</h3>
              
              {/* Hover Description */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: hoveredCuisine === cuisine.id ? 1 : 0,
                  y: hoveredCuisine === cuisine.id ? 0 : 10
                }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              >
                <p className="text-xs text-center text-white">{cuisine.description}</p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Clear Filter Button */}
      {selectedCuisine && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <button
            onClick={() => onCuisineSelect(null)}
            className="inline-flex items-center space-x-2 px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <span>Clear Filter</span>
            <span className="text-lg">✕</span>
          </button>
        </motion.div>
      )}
    </section>
  )
}