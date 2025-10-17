import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import RestaurantCard from "@/components/RestaurantCard";
import InteractiveMap from "@/components/InteractiveMap";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/contexts/AuthContext";
import { googlePlacesService, Restaurant } from "@/services/googlePlaces";
import { recommendationEngine } from "@/services/recommendations";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Grid, Sparkles, TrendingUp, Flame } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const { latitude, longitude, error } = useGeolocation();
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [newRestaurants, setNewRestaurants] = useState<Restaurant[]>([]);
  const [personalizedRestaurants, setPersonalizedRestaurants] = useState<Restaurant[]>([]);
  const [trendingRestaurants, setTrendingRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    loadRestaurants();
  }, [latitude, longitude, selectedCuisine]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const userLat = latitude || 40.7128; // Default to NYC
      const userLng = longitude || -74.0060;

      const allRestaurants = await googlePlacesService.searchNearbyRestaurants(
        userLat, 
        userLng, 
        5000, 
        selectedCuisine
      );

      setRestaurants(allRestaurants);
      setNewRestaurants(allRestaurants.filter(r => r.isNew));

      // Get personalized recommendations if user is logged in
      if (user) {
        const personalized = recommendationEngine.getPersonalizedRecommendations(
          allRestaurants, 
          user.id, 
          6
        );
        setPersonalizedRestaurants(personalized);
      }

      // Get trending recommendations
      const trending = recommendationEngine.getTrendingRecommendations(allRestaurants, 6);
      setTrendingRestaurants(trending);

    } catch (error) {
      console.error('Error loading restaurants:', error);
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleCuisineFilter = (cuisine: string) => {
    setSelectedCuisine(cuisine === selectedCuisine ? '' : cuisine);
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    toast.success(`Selected ${restaurant.name}`);
  };

  const userLocation = latitude && longitude ? { lat: latitude, lng: longitude } : undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* For You Section - Personalized Recommendations */}
        {user && personalizedRestaurants.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  For You
                </h2>
                <p className="text-muted-foreground">
                  Handpicked recommendations based on your taste profile
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personalizedRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} {...restaurant} />
              ))}
            </div>
          </section>
        )}

        {/* Trending Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="w-8 h-8 text-orange-500" />
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Trending Now
              </h2>
              <p className="text-muted-foreground">
                Popular restaurants everyone's talking about
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} {...restaurant} />
              ))}
            </div>
          )}
        </section>

        {/* New Restaurants */}
        {newRestaurants.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-accent" />
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  New Restaurants
                </h2>
                <p className="text-muted-foreground">
                  Just opened in your area
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} {...restaurant} />
              ))}
            </div>
          </section>
        )}

        {/* Explore Cuisines */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Explore International Cuisines
            </h2>
            <p className="text-muted-foreground mb-6">
              Filter by your favorite cuisine type
            </p>
            <CategoryFilter onCuisineSelect={handleCuisineFilter} selectedCuisine={selectedCuisine} />
          </div>

          {/* View Toggle */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {restaurants.length} restaurants found
              {selectedCuisine && ` for ${selectedCuisine}`}
            </p>
            
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'map')}>
              <TabsList>
                <TabsTrigger value="grid" className="flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="map" className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  Map
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content based on view mode */}
          {viewMode === 'grid' ? (
            loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-80 bg-muted animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} {...restaurant} />
                ))}
              </div>
            )
          ) : (
            <InteractiveMap
              restaurants={restaurants}
              userLocation={userLocation}
              onRestaurantSelect={handleRestaurantSelect}
            />
          )}
        </section>

        {/* Load More */}
        {!loading && restaurants.length > 0 && (
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={loadRestaurants}
              className="px-8"
            >
              Load More Restaurants
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
