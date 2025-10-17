import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import RestaurantCard from "@/components/RestaurantCard";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useNearbyRestaurants } from "@/hooks/useNearbyRestaurants";
import { useMemo, useState } from "react";
import { getTopRecommendations } from "@/lib/recommendations";
import { useTranslation } from "react-i18next";
import MapView from "@/components/MapView";
import { useTastePreferences } from "@/hooks/useTastePreferences";

const Index = () => {
  const { t } = useTranslation();
  const { latitude, longitude, loading: geoLoading } = useGeolocation();
  const [selectedCuisine, setSelectedCuisine] = useState<string>("All Cuisines");
  const { data: nearby, loading: nearbyLoading } = useNearbyRestaurants({
    latitude,
    longitude,
    cuisineKeyword: selectedCuisine,
    radiusMeters: 3500,
    fetchDetailsTopN: 6,
  });
  const { prefs } = useTastePreferences();

  const recommendations = useMemo(() => getTopRecommendations(nearby, prefs, 6), [nearby, prefs]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* New Restaurants */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{t('forYou')}</h2>
            <p className="text-muted-foreground">{t('recommendedForYou')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(geoLoading || nearbyLoading) && (
              <div className="text-muted-foreground">Loading recommendations...</div>
            )}
            {!geoLoading && !nearbyLoading && recommendations.map((r) => (
              <RestaurantCard
                key={r.placeId}
                name={r.name}
                cuisine={r.cuisineHint || 'Various'}
                rating={r.rating || 0}
                distance={t('nearby') as string}
                image={r.photoUrl || '/placeholder.svg'}
                placeId={r.placeId}
                reviewSnippet={r.reviews?.[0]?.text}
              />
            ))}
          </div>
        </section>

        {/* Explore Cuisines */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{t('exploreCuisines')}</h2>
            <p className="text-muted-foreground mb-6">{t('filterByCuisine')}</p>
            <div onClick={(e) => {
              const target = e.target as HTMLElement;
              const text = target?.textContent?.trim();
              if (text) setSelectedCuisine(text);
            }}>
              <CategoryFilter />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(geoLoading || nearbyLoading) && (
              <div className="text-muted-foreground">Loading nearby restaurants...</div>
            )}
            {!geoLoading && !nearbyLoading && nearby.map((r) => (
              <RestaurantCard
                key={r.placeId}
                name={r.name}
                cuisine={r.cuisineHint || 'Various'}
                rating={r.rating || 0}
                distance={t('nearby') as string}
                image={r.photoUrl || '/placeholder.svg'}
                placeId={r.placeId}
                reviewSnippet={r.reviews?.[0]?.text}
              />
            ))}
          </div>
          {!geoLoading && !nearbyLoading && (
            <div className="pt-8">
              <MapView center={nearby[0]?.location} restaurants={nearby} />
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
