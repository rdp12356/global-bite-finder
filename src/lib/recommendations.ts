import { NearbyRestaurant } from '@/hooks/useNearbyRestaurants';

export interface TastePreferences {
  isVegetarian?: boolean;
  isVegan?: boolean;
  spiceLevel?: number; // 1-5
  selectedCuisineIds?: Map<string, number>; // cuisineId -> preference level (1-5)
  // Lightweight map of cuisine name to preference if ids are not available
  preferredCuisineNames?: Map<string, number>;
}

export function scoreRestaurant(restaurant: NearbyRestaurant, prefs: TastePreferences | null): number {
  if (!prefs) {
    // Fallback: weight by rating and number of ratings
    return (restaurant.rating || 0) * 10 + Math.min(restaurant.userRatingsTotal || 0, 200) / 50;
  }

  let score = 0;
  score += (restaurant.rating || 0) * 12;
  score += Math.min(restaurant.userRatingsTotal || 0, 300) / 40;

  // Cuisine name hint scoring
  if (restaurant.cuisineHint && prefs.preferredCuisineNames) {
    const prefLevel = prefs.preferredCuisineNames.get(restaurant.cuisineHint) || 0;
    score += prefLevel * 6;
  }

  // Dietary constraints could down-rank certain places later if we classify menus.
  // For now, we keep a neutral stance and rely on cuisine preferences + ratings.

  return score;
}

export function getTopRecommendations(restaurants: NearbyRestaurant[], prefs: TastePreferences | null, limit = 6) {
  return [...restaurants]
    .sort((a, b) => scoreRestaurant(b, prefs) - scoreRestaurant(a, prefs))
    .slice(0, limit);
}
