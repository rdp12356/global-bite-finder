'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Star, MapPin, Clock, Phone, Heart, Share2, ExternalLink, Users, DollarSign } from 'lucide-react'
import { Restaurant } from '@/types/restaurant'

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null
  isOpen: boolean
  onClose: () => void
}

export function RestaurantDetailModal({ restaurant, isOpen, onClose }: RestaurantDetailModalProps) {
  const [isFavorite, setIsFavorite] = useState(restaurant?.isFavorite || false)
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'reviews'>('overview')

  useEffect(() => {
    if (restaurant) {
      setIsFavorite(restaurant.isFavorite || false)
    }
  }, [restaurant])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!restaurant) return null

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case '$': return 'text-green-600'
      case '$$': return 'text-yellow-600'
      case '$$$': return 'text-orange-600'
      case '$$$$': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: `Check out ${restaurant.name} - ${restaurant.cuisine} restaurant`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
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
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative h-64 md:h-80">
              <Image
                src={restaurant.image}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Action Buttons */}
              <div className="absolute top-4 left-4 flex space-x-2">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors duration-200 ${
                    isFavorite
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-gray-600 hover:bg-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:bg-white transition-colors duration-200"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="absolute bottom-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  restaurant.isOpen
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                }`}>
                  {restaurant.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>

              {/* Cuisine Badge */}
              <div className="absolute bottom-4 right-4">
                <span className="px-3 py-1 rounded-full bg-black/50 text-white text-sm font-medium backdrop-blur-sm">
                  {restaurant.cuisine}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Restaurant Info */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {restaurant.name}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{restaurant.address}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{restaurant.phone}</span>
                    </div>
                  </div>
                </div>
                <div className={`text-3xl font-bold ${getPriceColor(restaurant.priceRange)}`}>
                  {restaurant.priceRange}
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  {renderStars(restaurant.rating)}
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {restaurant.rating}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  ({restaurant.reviewCount} reviews)
                </span>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'menu', label: 'Menu' },
                  { id: 'reviews', label: 'Reviews' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px]">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        About
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {restaurant.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Popular Dishes
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {restaurant.popularDishes.map((dish, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                              <span className="text-primary-600 dark:text-primary-400 text-sm">🍽️</span>
                            </div>
                            <span className="text-gray-900 dark:text-white font-medium">{dish}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Hours</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{restaurant.hours}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Delivery Time</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{restaurant.deliveryTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {restaurant.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'menu' && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Menu Coming Soon
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We're working on bringing you the full menu experience.
                    </p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⭐</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Reviews Coming Soon
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Customer reviews will be available here soon.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="flex-1 btn-primary flex items-center justify-center space-x-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>Visit Website</span>
                </button>
                <button className="flex-1 btn-secondary flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}