import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import RestaurantCard from '@/components/RestaurantCard';
import '@/i18n';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchFavorites();
  }, [user, navigate]);

  const fetchFavorites = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        *,
        restaurants (
          *,
          restaurant_cuisines (
            cuisines (name)
          )
        )
      `)
      .eq('user_id', user.id);

    if (!error && data) {
      setFavorites(data);
    }

    setLoading(false);
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
        <h1 className="text-4xl font-bold mb-8">{t('favorites')}</h1>
        
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No favorites yet. Start exploring and save your favorite restaurants!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <RestaurantCard
                key={fav.id}
                name={fav.restaurants.name}
                cuisine={fav.restaurants.restaurant_cuisines?.[0]?.cuisines?.name || 'Various'}
                rating={fav.restaurants.rating || 0}
                distance="Nearby"
                image={fav.restaurants.photo_url || '/placeholder.svg'}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
