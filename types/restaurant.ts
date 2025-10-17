export interface Restaurant {
  id: string
  name: string
  cuisine: string
  rating: number
  reviewCount: number
  priceRange: '$' | '$$' | '$$$' | '$$$$'
  image: string
  address: string
  phone: string
  hours: string
  coordinates: {
    lat: number
    lng: number
  }
  isOpen: boolean
  deliveryTime: string
  popularDishes: string[]
  tags: string[]
  description: string
  isFavorite?: boolean
  distance?: number
}

export interface Review {
  id: string
  restaurantId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  date: string
  helpful: number
}

export interface Cuisine {
  id: string
  name: string
  emoji: string
  color: string
  description: string
  popularDishes: string[]
  averageRating: number
  restaurantCount: number
}