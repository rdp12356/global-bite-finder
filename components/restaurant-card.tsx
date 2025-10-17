'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star, MapPin, Clock, Phone, Heart, Share2, ExternalLink } from 'lucide-react'
import { Restaurant } from '@/types/restaurant'
import { RestaurantDetailModal } from './restaurant-detail-modal'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const [isFavorite, setIsFavorite] = useState(restaurant.isFavorite || false)
  const [imageError, setImageError] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
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

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="restaurant-card group"
        onClick={() => setShowModal(true)}
      >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {!imageError ? (
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
            <span className="text-4xl">🍽️</span>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-colors duration-200"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            restaurant.isOpen
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>

        {/* Cuisine Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm">
            {restaurant.cuisine}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 transition-colors duration-200">
              {restaurant.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{restaurant.address}</span>
            </div>
          </div>
          <div className={`text-2xl font-bold ${getPriceColor(restaurant.priceRange)}`}>
            {restaurant.priceRange}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(restaurant.rating)}
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {restaurant.rating}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({restaurant.reviewCount} reviews)
          </span>
        </div>

        {/* Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{restaurant.deliveryTime}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4" />
            <span>{restaurant.phone}</span>
          </div>
        </div>

        {/* Popular Dishes */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Popular Dishes
          </h4>
          <div className="flex flex-wrap gap-1">
            {restaurant.popularDishes.slice(0, 3).map((dish, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                {dish}
              </span>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {restaurant.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <button 
          className="w-full btn-primary text-sm py-2 flex items-center justify-center space-x-2"
          onClick={(e) => {
            e.stopPropagation()
            setShowModal(true)
          }}
        >
          <span>View Details</span>
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>

    <RestaurantDetailModal
      restaurant={restaurant}
      isOpen={showModal}
      onClose={() => setShowModal(false)}
    />
    </>
  )
}