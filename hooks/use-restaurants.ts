'use client'

import { useState, useEffect } from 'react'
import { Restaurant } from '@/types/restaurant'

interface Location {
  lat: number
  lng: number
  address: string
}

export function useRestaurants(location: Location | null, selectedCuisine: string | null) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!location) return

    const fetchRestaurants = async () => {
      setLoading(true)
      setError(null)

      try {
        // Mock data for demonstration - in production, this would call real APIs
        const mockRestaurants: Restaurant[] = [
          {
            id: '1',
            name: 'Bella Vista Italian',
            cuisine: 'Italian',
            rating: 4.8,
            reviewCount: 324,
            priceRange: '$$',
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop',
            address: '123 Main St, Downtown',
            phone: '+1 (555) 123-4567',
            hours: '11:00 AM - 10:00 PM',
            coordinates: { lat: location.lat + 0.001, lng: location.lng + 0.001 },
            isOpen: true,
            deliveryTime: '25-35 min',
            popularDishes: ['Margherita Pizza', 'Spaghetti Carbonara', 'Tiramisu'],
            tags: ['Family-friendly', 'Romantic', 'Outdoor seating'],
            description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes.'
          },
          {
            id: '2',
            name: 'Sakura Sushi Bar',
            cuisine: 'Japanese',
            rating: 4.9,
            reviewCount: 456,
            priceRange: '$$$',
            image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
            address: '456 Oak Ave, Midtown',
            phone: '+1 (555) 234-5678',
            hours: '5:00 PM - 11:00 PM',
            coordinates: { lat: location.lat - 0.002, lng: location.lng + 0.003 },
            isOpen: true,
            deliveryTime: '30-45 min',
            popularDishes: ['Salmon Sashimi', 'Dragon Roll', 'Miso Soup'],
            tags: ['Fresh', 'Authentic', 'Omakase'],
            description: 'Premium sushi and sashimi with the freshest fish from Japan.'
          },
          {
            id: '3',
            name: 'Spice Garden',
            cuisine: 'Indian',
            rating: 4.7,
            reviewCount: 289,
            priceRange: '$$',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop',
            address: '789 Pine St, Uptown',
            phone: '+1 (555) 345-6789',
            hours: '12:00 PM - 10:00 PM',
            coordinates: { lat: location.lat + 0.003, lng: location.lng - 0.001 },
            isOpen: true,
            deliveryTime: '20-30 min',
            popularDishes: ['Chicken Tikka Masala', 'Biryani', 'Naan Bread'],
            tags: ['Spicy', 'Vegetarian options', 'Family-owned'],
            description: 'Traditional Indian spices and flavors in every dish.'
          },
          {
            id: '4',
            name: 'El Mariachi',
            cuisine: 'Mexican',
            rating: 4.6,
            reviewCount: 198,
            priceRange: '$',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
            address: '321 Elm St, Downtown',
            phone: '+1 (555) 456-7890',
            hours: '10:00 AM - 11:00 PM',
            coordinates: { lat: location.lat - 0.001, lng: location.lng - 0.002 },
            isOpen: true,
            deliveryTime: '15-25 min',
            popularDishes: ['Carnitas Tacos', 'Churros', 'Horchata'],
            tags: ['Fast', 'Authentic', 'Late night'],
            description: 'Authentic Mexican street food with bold flavors and fresh ingredients.'
          },
          {
            id: '5',
            name: 'Bangkok Express',
            cuisine: 'Thai',
            rating: 4.5,
            reviewCount: 167,
            priceRange: '$$',
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561a1a?w=400&h=300&fit=crop',
            address: '654 Maple Ave, Midtown',
            phone: '+1 (555) 567-8901',
            hours: '11:30 AM - 9:30 PM',
            coordinates: { lat: location.lat + 0.002, lng: location.lng + 0.002 },
            isOpen: true,
            deliveryTime: '25-35 min',
            popularDishes: ['Pad Thai', 'Green Curry', 'Mango Sticky Rice'],
            tags: ['Spicy', 'Fresh', 'Authentic'],
            description: 'Traditional Thai cuisine with authentic flavors and fresh herbs.'
          },
          {
            id: '6',
            name: 'Le Petit Bistro',
            cuisine: 'French',
            rating: 4.9,
            reviewCount: 89,
            priceRange: '$$$',
            image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
            address: '987 Cedar St, Uptown',
            phone: '+1 (555) 678-9012',
            hours: '6:00 PM - 10:00 PM',
            coordinates: { lat: location.lat - 0.003, lng: location.lng + 0.001 },
            isOpen: false,
            deliveryTime: '45-60 min',
            popularDishes: ['Coq au Vin', 'Ratatouille', 'Crème Brûlée'],
            tags: ['Fine dining', 'Romantic', 'Wine selection'],
            description: 'Elegant French cuisine with classic techniques and modern presentation.'
          }
        ]

        // Filter by cuisine if selected
        let filteredRestaurants = mockRestaurants
        if (selectedCuisine) {
          filteredRestaurants = mockRestaurants.filter(
            restaurant => restaurant.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
          )
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setRestaurants(filteredRestaurants)
      } catch (err) {
        setError('Failed to fetch restaurants')
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [location, selectedCuisine])

  return { restaurants, loading, error }
}