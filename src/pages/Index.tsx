import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import RestaurantCard from "@/components/RestaurantCard";
import { useI18n } from "@/i18n";
import MapView from "@/components/MapView";
import { useAuth } from "@/contexts/AuthContext";
import restaurant1 from "@/assets/restaurant-1.jpg";
import restaurant2 from "@/assets/restaurant-2.jpg";
import restaurant3 from "@/assets/restaurant-3.jpg";
import restaurant4 from "@/assets/restaurant-4.jpg";
import restaurant5 from "@/assets/restaurant-5.jpg";
import restaurant6 from "@/assets/restaurant-6.jpg";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGeolocation } from "@/hooks/useGeolocation";

const Index = () => {
  const newRestaurants = [
    {
      name: "Sakura Sushi Bar",
      cuisine: "Japanese Cuisine",
      rating: 4.8,
      distance: "0.5 km",
      image: restaurant1,
      isNew: true,
    },
    {
      name: "La Cucina Italiana",
      cuisine: "Italian Cuisine",
      rating: 4.7,
      distance: "1.2 km",
      image: restaurant2,
      isNew: true,
    },
    {
      name: "Taco Fiesta",
      cuisine: "Mexican Cuisine",
      rating: 4.6,
      distance: "0.8 km",
      image: restaurant3,
      isNew: true,
    },
  ];

  const allRestaurants = [
    {
      name: "Spice Route",
      cuisine: "Indian Cuisine",
      rating: 4.9,
      distance: "1.5 km",
      image: restaurant4,
    },
    {
      name: "Mykonos Taverna",
      cuisine: "Mediterranean Cuisine",
      rating: 4.7,
      distance: "2.1 km",
      image: restaurant5,
    },
    {
      name: "Café Parisien",
      cuisine: "French Cuisine",
      rating: 4.8,
      distance: "1.8 km",
      image: restaurant6,
    },
  ];

  const { t } = useI18n?.() ?? { t: (s: any) => s } as any;
  const { user } = useAuth?.() ?? { user: null } as any;

  const { latitude, longitude } = useGeolocation();

  const { data: nearby } = useQuery({
    queryKey: ["nearby-restaurants", latitude, longitude],
    enabled: !!latitude && !!longitude,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("id,name,latitude,longitude,rating,photo_url,restaurant_cuisines(cuisines(name))")
        .limit(24);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* New Restaurants */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{t('new_restaurants')}</h2>
            <p className="text-muted-foreground">{t('just_opened')}</p>
          </div>
          
          {nearby && (
            <MapView
              restaurants={nearby.map((r: any) => ({ id: r.id, name: r.name, latitude: r.latitude, longitude: r.longitude }))}
              center={latitude && longitude ? { latitude, longitude } : null}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(nearby && nearby.length > 0 ? nearby.slice(0, 6).map((r: any) => ({
              id: r.id,
              name: r.name,
              cuisine: r.restaurant_cuisines?.[0]?.cuisines?.name ?? 'Various',
              rating: r.rating ?? 0,
              distance: '—',
              image: r.photo_url || restaurant1,
              isNew: true,
            })) : newRestaurants).map((restaurant: any) => (
              <RestaurantCard key={restaurant.name} {...restaurant} />
            ))}
          </div>
        </section>

        {/* For You */}
        {user && nearby && nearby.length > 0 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">For You</h2>
              <p className="text-muted-foreground mb-6">Handpicked picks based on your taste</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearby.slice(0, 6).map((r: any) => (
                <RestaurantCard
                  key={r.id}
                  id={r.id}
                  name={r.name}
                  cuisine={r.restaurant_cuisines?.[0]?.cuisines?.name ?? 'Various'}
                  rating={r.rating ?? 0}
                  distance={'—'}
                  image={r.photo_url || restaurant3}
                  isNew
                />
              ))}
            </div>
          </section>
        )}

        {/* Explore Cuisines */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{t('explore_cuisines')}</h2>
            <p className="text-muted-foreground mb-6">{t('filter_favorites')}</p>
            <CategoryFilter />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(nearby && nearby.length > 0 ? nearby.map((r: any) => ({
              id: r.id,
              name: r.name,
              cuisine: r.restaurant_cuisines?.[0]?.cuisines?.name ?? 'Various',
              rating: r.rating ?? 0,
              distance: '—',
              image: r.photo_url || restaurant2,
            })) : allRestaurants).map((restaurant: any) => (
              <RestaurantCard key={restaurant.name} {...restaurant} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
