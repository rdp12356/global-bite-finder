import { Restaurant } from './googlePlaces';

interface UserPreferences {
  selectedCuisines: Map<string, number>;
  isVegetarian: boolean;
  isVegan: boolean;
  spiceLevel: number;
  priceRange: number;
  dietaryRestrictions: string[];
}

interface UserBehavior {
  favoriteRestaurants: string[];
  visitedRestaurants: string[];
  ratedRestaurants: Map<string, number>;
  searchHistory: string[];
}

class RecommendationEngine {
  private getUserPreferences(userId: string): UserPreferences | null {
    try {
      const saved = localStorage.getItem(`preferences_${userId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          selectedCuisines: new Map(parsed.selectedCuisines || [])
        };
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
    return null;
  }

  private getUserBehavior(userId: string): UserBehavior {
    try {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
      const visited = JSON.parse(localStorage.getItem(`visited_${userId}`) || '[]');
      const rated = new Map(JSON.parse(localStorage.getItem(`ratings_${userId}`) || '[]'));
      const searches = JSON.parse(localStorage.getItem(`searches_${userId}`) || '[]');

      return {
        favoriteRestaurants: favorites,
        visitedRestaurants: visited,
        ratedRestaurants: rated,
        searchHistory: searches
      };
    } catch (error) {
      console.error('Error loading user behavior:', error);
      return {
        favoriteRestaurants: [],
        visitedRestaurants: [],
        ratedRestaurants: new Map(),
        searchHistory: []
      };
    }
  }

  calculateRestaurantScore(restaurant: Restaurant, preferences: UserPreferences, behavior: UserBehavior): number {
    let score = 0;

    // Base rating score (30% weight)
    score += restaurant.rating * 0.3;

    // Cuisine preference score (25% weight)
    const cuisineKey = restaurant.cuisine.toLowerCase().replace(' cuisine', '');
    if (preferences.selectedCuisines.has(cuisineKey)) {
      score += preferences.selectedCuisines.get(cuisineKey)! * 0.25;
    }

    // Dietary compatibility (20% weight)
    if (preferences.isVegetarian || preferences.isVegan) {
      // In a real app, you'd check if the restaurant has vegetarian/vegan options
      // For now, we'll give a bonus to certain cuisine types
      const vegFriendlyCuisines = ['indian', 'mediterranean', 'italian', 'thai'];
      if (vegFriendlyCuisines.some(cuisine => restaurant.cuisine.toLowerCase().includes(cuisine))) {
        score += 1.0 * 0.2;
      }
    }

    // Price compatibility (10% weight)
    if (restaurant.priceLevel) {
      const priceDiff = Math.abs(restaurant.priceLevel - preferences.priceRange);
      score += Math.max(0, (4 - priceDiff) / 4) * 0.1;
    }

    // Behavioral signals (15% weight)
    if (behavior.favoriteRestaurants.includes(restaurant.id || '')) {
      score += 2.0 * 0.15; // High boost for favorites
    }

    if (behavior.ratedRestaurants.has(restaurant.id || '')) {
      const userRating = behavior.ratedRestaurants.get(restaurant.id || '')!;
      score += (userRating / 5) * 0.15;
    }

    // Freshness bonus for new restaurants
    if (restaurant.isNew) {
      score += 0.5;
    }

    // Distance penalty (closer is better)
    const distance = parseFloat(restaurant.distance.replace(' km', ''));
    if (distance > 5) {
      score -= 0.2;
    }

    return Math.min(5, Math.max(0, score));
  }

  getPersonalizedRecommendations(
    restaurants: Restaurant[], 
    userId: string, 
    limit: number = 10
  ): Restaurant[] {
    const preferences = this.getUserPreferences(userId);
    const behavior = this.getUserBehavior(userId);

    if (!preferences) {
      // Return top-rated restaurants if no preferences
      return restaurants
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    }

    // Calculate scores and sort
    const scoredRestaurants = restaurants.map(restaurant => ({
      restaurant,
      score: this.calculateRestaurantScore(restaurant, preferences, behavior)
    }));

    return scoredRestaurants
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.restaurant);
  }

  getTrendingRecommendations(restaurants: Restaurant[], limit: number = 6): Restaurant[] {
    // Simulate trending based on rating, newness, and random popularity
    return restaurants
      .map(restaurant => ({
        restaurant,
        trendScore: restaurant.rating * 0.4 + 
                   (restaurant.isNew ? 1.5 : 0) + 
                   Math.random() * 0.5
      }))
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit)
      .map(item => item.restaurant);
  }

  getCuisineRecommendations(
    restaurants: Restaurant[], 
    cuisine: string, 
    limit: number = 10
  ): Restaurant[] {
    return restaurants
      .filter(restaurant => 
        restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase())
      )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  recordUserInteraction(userId: string, restaurantId: string, interactionType: 'view' | 'favorite' | 'visit' | 'rate', value?: number) {
    try {
      switch (interactionType) {
        case 'favorite':
          const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
          if (!favorites.includes(restaurantId)) {
            favorites.push(restaurantId);
            localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
          }
          break;
        
        case 'visit':
          const visited = JSON.parse(localStorage.getItem(`visited_${userId}`) || '[]');
          if (!visited.includes(restaurantId)) {
            visited.push(restaurantId);
            localStorage.setItem(`visited_${userId}`, JSON.stringify(visited));
          }
          break;
        
        case 'rate':
          if (value !== undefined) {
            const ratings = new Map(JSON.parse(localStorage.getItem(`ratings_${userId}`) || '[]'));
            ratings.set(restaurantId, value);
            localStorage.setItem(`ratings_${userId}`, JSON.stringify(Array.from(ratings.entries())));
          }
          break;
      }
    } catch (error) {
      console.error('Error recording user interaction:', error);
    }
  }

  removeFavorite(userId: string, restaurantId: string) {
    try {
      const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
      const updated = favorites.filter((id: string) => id !== restaurantId);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  }
}

export const recommendationEngine = new RecommendationEngine();