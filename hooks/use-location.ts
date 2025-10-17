'use client'

import { useState, useEffect } from 'react'

interface Location {
  lat: number
  lng: number
  address: string
}

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // Reverse geocoding to get address
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          )
          
          if (!response.ok) {
            throw new Error('Failed to fetch address')
          }
          
          const data = await response.json()
          const address = data.results[0]?.formatted_address || 'Unknown location'
          
          setLocation({
            lat: latitude,
            lng: longitude,
            address
          })
        } catch (err) {
          setError('Failed to get location details')
        } finally {
          setLoading(false)
        }
      },
      (err) => {
        setError('Location access denied or failed')
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }, [])

  return { location, loading, error }
}