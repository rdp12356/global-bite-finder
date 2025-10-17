'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Heart, Star } from 'lucide-react'
import { useAuth } from './auth-provider'

interface TasteProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const cuisinePreferences = [
  { id: 'italian', name: 'Italian', emoji: '🍝' },
  { id: 'japanese', name: 'Japanese', emoji: '🍣' },
  { id: 'indian', name: 'Indian', emoji: '🍛' },
  { id: 'mexican', name: 'Mexican', emoji: '🌮' },
  { id: 'thai', name: 'Thai', emoji: '🍜' },
  { id: 'french', name: 'French', emoji: '🥐' },
  { id: 'chinese', name: 'Chinese', emoji: '🥢' },
  { id: 'korean', name: 'Korean', emoji: '🍲' },
  { id: 'mediterranean', name: 'Mediterranean', emoji: '🫒' },
  { id: 'american', name: 'American', emoji: '🍔' }
]

const dietaryRestrictions = [
  { id: 'vegetarian', name: 'Vegetarian', emoji: '🥬' },
  { id: 'vegan', name: 'Vegan', emoji: '🌱' },
  { id: 'gluten-free', name: 'Gluten-Free', emoji: '🌾' },
  { id: 'dairy-free', name: 'Dairy-Free', emoji: '🥛' },
  { id: 'nut-free', name: 'Nut-Free', emoji: '🥜' },
  { id: 'halal', name: 'Halal', emoji: '☪️' },
  { id: 'kosher', name: 'Kosher', emoji: '✡️' }
]

const spiceLevels = [
  { id: 'mild', name: 'Mild', description: 'No spice, please' },
  { id: 'medium', name: 'Medium', description: 'A little kick' },
  { id: 'hot', name: 'Hot', description: 'Bring the heat!' }
]

export function TasteProfileModal({ isOpen, onClose }: TasteProfileModalProps) {
  const { user, updateTasteProfile } = useAuth()
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [selectedDietary, setSelectedDietary] = useState<string[]>([])
  const [spiceLevel, setSpiceLevel] = useState<string>('medium')
  const [saving, setSaving] = useState(false)

  const handleCuisineToggle = (cuisineId: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisineId) 
        ? prev.filter(id => id !== cuisineId)
        : [...prev, cuisineId]
    )
  }

  const handleDietaryToggle = (dietaryId: string) => {
    setSelectedDietary(prev => 
      prev.includes(dietaryId) 
        ? prev.filter(id => id !== dietaryId)
        : [...prev, dietaryId]
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      updateTasteProfile({
        favoriteCuisines: selectedCuisines,
        dietaryRestrictions: selectedDietary,
        spiceLevel: spiceLevel as 'mild' | 'medium' | 'hot'
      })
      onClose()
    } catch (error) {
      console.error('Failed to save taste profile:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Your Taste Profile
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Help us recommend restaurants you'll love
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Favorite Cuisines */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Favorite Cuisines
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {cuisinePreferences.map((cuisine) => (
                    <button
                      key={cuisine.id}
                      onClick={() => handleCuisineToggle(cuisine.id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedCuisines.includes(cuisine.id)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <span className="text-2xl">{cuisine.emoji}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {cuisine.name}
                      </span>
                      {selectedCuisines.includes(cuisine.id) && (
                        <Check className="w-4 h-4 text-primary-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Dietary Restrictions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {dietaryRestrictions.map((dietary) => (
                    <button
                      key={dietary.id}
                      onClick={() => handleDietaryToggle(dietary.id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedDietary.includes(dietary.id)
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <span className="text-2xl">{dietary.emoji}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {dietary.name}
                      </span>
                      {selectedDietary.includes(dietary.id) && (
                        <Check className="w-4 h-4 text-primary-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spice Level */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Spice Level Preference
                </h3>
                <div className="space-y-3">
                  {spiceLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setSpiceLevel(level.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                        spiceLevel === level.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {level.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {level.description}
                        </div>
                      </div>
                      {spiceLevel === level.id && (
                        <Check className="w-5 h-5 text-primary-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Heart className="w-4 h-4" />
                  )}
                  <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}