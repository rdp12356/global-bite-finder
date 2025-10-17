import { useEffect, useMemo, useState } from 'react';
import { loadGoogleMaps } from '@/lib/googleMapsLoader';

export interface NearbyRestaurant {
  placeId: string;
  name: string;
  address?: string;
  rating?: number;
  userRatingsTotal?: number;
  location?: { lat: number; lng: number };
  photoUrl?: string;
  priceLevel?: number;
  isOpenNow?: boolean;
  cuisineHint?: string;
  reviews?: Array<{ authorName?: string; rating?: number; text?: string }>;
}

interface UseNearbyRestaurantsParams {
  latitude: number | null;
  longitude: number | null;
  cuisineKeyword?: string; // e.g., "Japanese", "Italian"
  radiusMeters?: number; // defaults to 3000m
  fetchDetailsTopN?: number; // fetch details for top N
}

export function useNearbyRestaurants({
  latitude,
  longitude,
  cuisineKeyword,
  radiusMeters = 3000,
  fetchDetailsTopN = 8,
}: UseNearbyRestaurantsParams) {
  const [data, setData] = useState<NearbyRestaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasLocation = useMemo(() => typeof latitude === 'number' && typeof longitude === 'number', [latitude, longitude]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!hasLocation) return;
      setLoading(true);
      setError(null);

      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
        const google = await loadGoogleMaps(apiKey);

        const service = new google.maps.places.PlacesService(document.createElement('div'));
        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(latitude as number, longitude as number),
          radius: radiusMeters,
          type: 'restaurant',
          openNow: true,
          keyword: cuisineKeyword && cuisineKeyword !== 'All Cuisines' ? cuisineKeyword : undefined,
        };

        const nearbyResults: google.maps.places.PlaceResult[] = await new Promise((resolve, reject) => {
          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
              resolve([]);
            } else {
              reject(new Error(`Places nearbySearch failed: ${status}`));
            }
          });
        });

        const mapped: NearbyRestaurant[] = (nearbyResults || []).map((r) => {
          const photoUrl = r.photos?.[0]?.getUrl({ maxWidth: 800, maxHeight: 600 });
          const loc = r.geometry?.location;
          return {
            placeId: r.place_id!,
            name: r.name || 'Unknown',
            address: r.vicinity || r.formatted_address,
            rating: r.rating,
            userRatingsTotal: r.user_ratings_total,
            location: loc ? { lat: loc.lat(), lng: loc.lng() } : undefined,
            photoUrl: photoUrl || '/placeholder.svg',
            priceLevel: (r.price_level as number | undefined) ?? undefined,
            isOpenNow: r.opening_hours?.isOpen(),
            cuisineHint: cuisineKeyword,
          };
        });

        // Optionally fetch details for richer content (reviews, photos)
        const toDetail = mapped.slice(0, fetchDetailsTopN);
        const detailed: Record<string, NearbyRestaurant> = {};

        await Promise.all(
          toDetail.map(async (item) => {
            try {
              const details = await new Promise<google.maps.places.PlaceResult | null>((resolve) => {
                service.getDetails(
                  {
                    placeId: item.placeId,
                    fields: [
                      'place_id',
                      'name',
                      'rating',
                      'user_ratings_total',
                      'review',
                      'reviews',
                      'photos',
                      'formatted_address',
                      'geometry',
                    ],
                  },
                  (res, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK && res) {
                      resolve(res);
                    } else {
                      resolve(null);
                    }
                  }
                );
              });

              if (details) {
                const photoUrl = details.photos?.[0]?.getUrl({ maxWidth: 800, maxHeight: 600 }) || item.photoUrl;
                detailed[item.placeId] = {
                  ...item,
                  address: details.formatted_address || item.address,
                  rating: details.rating ?? item.rating,
                  userRatingsTotal: details.user_ratings_total ?? item.userRatingsTotal,
                  photoUrl,
                  reviews:
                    details.reviews?.map((rev) => ({
                      authorName: (rev as any).author_name,
                      rating: rev.rating,
                      text: rev.text,
                    })) || [],
                };
              }
            } catch {
              // ignore detail failure per item
            }
          })
        );

        const merged = mapped.map((m) => detailed[m.placeId] || m);
        if (!cancelled) setData(merged);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Failed to fetch nearby restaurants');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [hasLocation, latitude, longitude, cuisineKeyword, radiusMeters, fetchDetailsTopN]);

  return { data, loading, error };
}
