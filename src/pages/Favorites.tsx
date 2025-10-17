import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { googlePlacesService, Restaurant } from '@/services/googlePlaces';
import { recommendationEngine } from '@/services/recommendations';
import RestaurantCard from '@/components/RestaurantCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Heart, TrendingUp, MapPin, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<Restaurant[]>([]);
  const [recommendedRestaurants, setRecommendedRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('favorites');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchFavorites();
  }, [user, navigate]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      // Get favorite restaurant IDs from localStorage
      const favoriteIds = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
      
      if (favoriteIds.length > 0) {
        // Get all restaurants and filter favorites
        const allRestaurants = await googlePlacesService.searchNearbyRestaurants(40.7128, -74.0060, 10000);
        const favorites = allRestaurants.filter(restaurant => favoriteIds.includes(restaurant.id));
        setFavoriteRestaurants(favorites);

        // Get recommendations based on favorites
        const recommendations = recommendationEngine.getPersonalizedRecommendations(
          allRestaurants.filter(r => !favoriteIds.includes(r.id)), 
          user.id, 
          6
        );
        setRecommendedRestaurants(recommendations);
      } else {
        // If no favorites, get general recommendations
        const allRestaurants = await googlePlacesService.searchNearbyRestaurants(40.7128, -74.0060, 10000);
        const recommendations = recommendationEngine.getTrendingRecommendations(allRestaurants, 6);
        setRecommendedRestaurants(recommendations);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorites');
    }

    setLoading(false);
  };

  const handleRemoveFavorite = (restaurantId: string) => {
    if (!user) return;
    
    recommendationEngine.removeFavorite(user.id, restaurantId);
    setFavoriteRestaurants(prev => prev.filter(r => r.id !== restaurantId));
    toast.success('Removed from favorites');
  };

  const handleShareFavorites = async () => {
    if (favoriteRestaurants.length === 0) return;

    const shareText = `Check out my favorite restaurants:\n${favoriteRestaurants.map(r => `• ${r.name} - ${r.cuisine}`).join('\n')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Favorite Restaurants',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success('Favorites copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold">Your Favorites</h1>
          </div>
          
          {favoriteRestaurants.length > 0 && (
            <Button onClick={handleShareFavorites} variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Favorites
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Favorites ({favoriteRestaurants.length})
            </TabsTrigger>
            <TabsTrigger value="recommended" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Recommended for You
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites" className="space-y-6">
            {favoriteRestaurants.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent className="space-y-4">
                  <Heart className="w-16 h-16 mx-auto text-muted-foreground" />
                  <div>
                    <CardTitle className="text-2xl mb-2">No favorites yet</CardTitle>
                    <CardDescription className="text-lg">
                      Start exploring and save your favorite restaurants!
                    </CardDescription>
                  </div>
                  <Button onClick={() => navigate('/')} className="mt-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    Discover Restaurants
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    {...restaurant}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommended" className="space-y-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Recommended for You</h3>
              <p className="text-muted-foreground">
                Based on your favorites and taste preferences
              </p>
            </div>
            
            {recommendedRestaurants.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <TrendingUp className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <CardTitle className="text-xl mb-2">No recommendations yet</CardTitle>
                  <CardDescription>
                    Add some favorites and set your taste preferences to get personalized recommendations!
                  </CardDescription>
                  <div className="flex gap-3 justify-center mt-4">
                    <Button onClick={() => navigate('/preferences')} variant="outline">
                      Set Preferences
                    </Button>
                    <Button onClick={() => navigate('/')}>
                      Explore Restaurants
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    {...restaurant}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Favorites;
