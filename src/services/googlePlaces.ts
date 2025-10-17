interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  distance: string;
  image: string;
  address: string;
  phone?: string;
  website?: string;
  priceLevel?: number;
  isOpen?: boolean;
  reviews?: Review[];
  popularDishes?: string[];
  isNew?: boolean;
}

interface Review {
  author: string;
  rating: number;
  text: string;
  time: string;
}

class GooglePlacesService {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  }

  async searchNearbyRestaurants(
    latitude: number, 
    longitude: number, 
    radius: number = 5000,
    cuisine?: string
  ): Promise<Restaurant[]> {
    if (!this.apiKey) {
      console.warn('Google Maps API key not found. Using mock data.');
      return this.getMockRestaurants(latitude, longitude);
    }

    try {
      const location = `${latitude},${longitude}`;
      const type = 'restaurant';
      const keyword = cuisine ? `${cuisine} restaurant` : 'restaurant';
      
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&keyword=${keyword}&key=${this.apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return this.formatRestaurants(data.results, latitude, longitude);
      } else {
        console.error('Google Places API error:', data.status);
        return this.getMockRestaurants(latitude, longitude);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return this.getMockRestaurants(latitude, longitude);
    }
  }

  private formatRestaurants(places: any[], userLat: number, userLng: number): Restaurant[] {
    return places.map((place, index) => {
      const distance = this.calculateDistance(
        userLat, 
        userLng, 
        place.geometry.location.lat, 
        place.geometry.location.lng
      );

      return {
        id: place.place_id,
        name: place.name,
        cuisine: this.determineCuisine(place.types, place.name),
        rating: place.rating || 4.0,
        distance: `${distance.toFixed(1)} km`,
        image: place.photos?.[0] 
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${this.apiKey}`
          : this.getDefaultImage(index),
        address: place.vicinity,
        priceLevel: place.price_level,
        isOpen: place.opening_hours?.open_now,
        isNew: Math.random() > 0.8, // Simulate new restaurants
        popularDishes: this.getPopularDishes(place.types, place.name)
      };
    });
  }

  private determineCuisine(types: string[], name: string): string {
    const cuisineMap: { [key: string]: string } = {
      'italian': 'Italian Cuisine',
      'japanese': 'Japanese Cuisine',
      'chinese': 'Chinese Cuisine',
      'indian': 'Indian Cuisine',
      'mexican': 'Mexican Cuisine',
      'thai': 'Thai Cuisine',
      'french': 'French Cuisine',
      'mediterranean': 'Mediterranean Cuisine',
      'american': 'American Cuisine',
      'korean': 'Korean Cuisine',
      'vietnamese': 'Vietnamese Cuisine',
      'greek': 'Greek Cuisine'
    };

    const nameAndTypes = (name + ' ' + types.join(' ')).toLowerCase();
    
    for (const [key, value] of Object.entries(cuisineMap)) {
      if (nameAndTypes.includes(key)) {
        return value;
      }
    }

    return 'International Cuisine';
  }

  private getPopularDishes(types: string[], name: string): string[] {
    const dishMap: { [key: string]: string[] } = {
      'italian': ['Margherita Pizza', 'Carbonara', 'Tiramisu'],
      'japanese': ['Sushi Platter', 'Ramen', 'Tempura'],
      'chinese': ['Kung Pao Chicken', 'Fried Rice', 'Dumplings'],
      'indian': ['Butter Chicken', 'Biryani', 'Naan'],
      'mexican': ['Tacos', 'Burrito Bowl', 'Guacamole'],
      'thai': ['Pad Thai', 'Green Curry', 'Tom Yum'],
      'french': ['Coq au Vin', 'Croissant', 'Crème Brûlée']
    };

    const nameAndTypes = (name + ' ' + types.join(' ')).toLowerCase();
    
    for (const [key, dishes] of Object.entries(dishMap)) {
      if (nameAndTypes.includes(key)) {
        return dishes;
      }
    }

    return ['Chef Special', 'House Favorite', 'Signature Dish'];
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  private getDefaultImage(index: number): string {
    const images = [
      '/src/assets/restaurant-1.jpg',
      '/src/assets/restaurant-2.jpg',
      '/src/assets/restaurant-3.jpg',
      '/src/assets/restaurant-4.jpg',
      '/src/assets/restaurant-5.jpg',
      '/src/assets/restaurant-6.jpg'
    ];
    return images[index % images.length];
  }

  private getMockRestaurants(latitude: number, longitude: number): Restaurant[] {
    return [
      {
        id: 'mock-1',
        name: 'Sakura Sushi Bar',
        cuisine: 'Japanese Cuisine',
        rating: 4.8,
        distance: '0.5 km',
        image: '/src/assets/restaurant-1.jpg',
        address: '123 Main St',
        isOpen: true,
        isNew: true,
        popularDishes: ['Sushi Platter', 'Ramen', 'Tempura']
      },
      {
        id: 'mock-2',
        name: 'La Cucina Italiana',
        cuisine: 'Italian Cuisine',
        rating: 4.7,
        distance: '1.2 km',
        image: '/src/assets/restaurant-2.jpg',
        address: '456 Oak Ave',
        isOpen: true,
        isNew: true,
        popularDishes: ['Margherita Pizza', 'Carbonara', 'Tiramisu']
      },
      {
        id: 'mock-3',
        name: 'Spice Route',
        cuisine: 'Indian Cuisine',
        rating: 4.9,
        distance: '1.5 km',
        image: '/src/assets/restaurant-4.jpg',
        address: '789 Elm St',
        isOpen: true,
        popularDishes: ['Butter Chicken', 'Biryani', 'Naan']
      },
      {
        id: 'mock-4',
        name: 'Taco Fiesta',
        cuisine: 'Mexican Cuisine',
        rating: 4.6,
        distance: '0.8 km',
        image: '/src/assets/restaurant-3.jpg',
        address: '321 Pine St',
        isOpen: true,
        isNew: true,
        popularDishes: ['Tacos', 'Burrito Bowl', 'Guacamole']
      },
      {
        id: 'mock-5',
        name: 'Bangkok Street',
        cuisine: 'Thai Cuisine',
        rating: 4.7,
        distance: '2.1 km',
        image: '/src/assets/restaurant-5.jpg',
        address: '654 Cedar Ave',
        isOpen: true,
        popularDishes: ['Pad Thai', 'Green Curry', 'Tom Yum']
      },
      {
        id: 'mock-6',
        name: 'Café Parisien',
        cuisine: 'French Cuisine',
        rating: 4.8,
        distance: '1.8 km',
        image: '/src/assets/restaurant-6.jpg',
        address: '987 Maple Dr',
        isOpen: true,
        popularDishes: ['Coq au Vin', 'Croissant', 'Crème Brûlée']
      }
    ];
  }
}

export const googlePlacesService = new GooglePlacesService();
export type { Restaurant, Review };