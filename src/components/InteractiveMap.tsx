import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Restaurant } from '@/services/googlePlaces';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Layers } from 'lucide-react';
import { toast } from 'sonner';

interface InteractiveMapProps {
  restaurants: Restaurant[];
  userLocation?: { lat: number; lng: number };
  onRestaurantSelect?: (restaurant: Restaurant) => void;
}

const InteractiveMap = ({ restaurants, userLocation, onRestaurantSelect }: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    if (map && restaurants.length > 0) {
      updateMarkers();
    }
  }, [map, restaurants]);

  const initializeMap = async () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      toast.error('Google Maps API key not configured');
      setIsLoading(false);
      return;
    }

    try {
      const loader = new Loader({
        apiKey,
        version: 'weekly',
        libraries: ['places', 'geometry']
      });

      await loader.load();

      if (!mapRef.current) return;

      const defaultCenter = userLocation || { lat: 40.7128, lng: -74.0060 }; // NYC default

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 14,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true
      });

      setMap(mapInstance);
      setIsLoading(false);

      // Add user location marker if available
      if (userLocation) {
        new google.maps.Marker({
          position: userLocation,
          map: mapInstance,
          title: 'Your Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });
      }

    } catch (error) {
      console.error('Error loading Google Maps:', error);
      toast.error('Failed to load map');
      setIsLoading(false);
    }
  };

  const updateMarkers = () => {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    const newMarkers = restaurants.map((restaurant, index) => {
      // For mock data, generate random nearby coordinates
      const lat = userLocation ? 
        userLocation.lat + (Math.random() - 0.5) * 0.02 : 
        40.7128 + (Math.random() - 0.5) * 0.02;
      const lng = userLocation ? 
        userLocation.lng + (Math.random() - 0.5) * 0.02 : 
        -74.0060 + (Math.random() - 0.5) * 0.02;

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: restaurant.name,
        icon: {
          path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          scale: 6,
          fillColor: getCuisineColor(restaurant.cuisine),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 1
        }
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <h3 class="font-semibold text-lg mb-1">${restaurant.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${restaurant.cuisine}</p>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-yellow-500">★</span>
              <span class="text-sm font-medium">${restaurant.rating}</span>
              <span class="text-sm text-gray-500">• ${restaurant.distance}</span>
            </div>
            ${restaurant.address ? `<p class="text-xs text-gray-500">${restaurant.address}</p>` : ''}
            ${restaurant.popularDishes && restaurant.popularDishes.length > 0 ? 
              `<div class="mt-2">
                <p class="text-xs font-medium text-gray-700 mb-1">Popular:</p>
                <p class="text-xs text-gray-600">${restaurant.popularDishes.slice(0, 2).join(', ')}</p>
              </div>` : ''
            }
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        if (onRestaurantSelect) {
          onRestaurantSelect(restaurant);
        }
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      if (userLocation) {
        bounds.extend(userLocation);
      }
      map.fitBounds(bounds);
    }
  };

  const getCuisineColor = (cuisine: string): string => {
    const colors: { [key: string]: string } = {
      'Italian Cuisine': '#e74c3c',
      'Japanese Cuisine': '#f39c12',
      'Chinese Cuisine': '#e67e22',
      'Indian Cuisine': '#d35400',
      'Mexican Cuisine': '#27ae60',
      'Thai Cuisine': '#2ecc71',
      'French Cuisine': '#9b59b6',
      'Mediterranean Cuisine': '#3498db',
      'American Cuisine': '#34495e',
      'Korean Cuisine': '#e91e63'
    };
    return colors[cuisine] || '#95a5a6';
  };

  const centerOnUser = () => {
    if (map && userLocation) {
      map.setCenter(userLocation);
      map.setZoom(15);
    } else {
      toast.error('Location not available');
    }
  };

  if (isLoading) {
    return (
      <Card className="h-96 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div ref={mapRef} className="h-96 w-full" />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={centerOnUser}
          className="bg-background/90 backdrop-blur-sm shadow-lg"
        >
          <Navigation className="w-4 h-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-muted-foreground">Your Location</span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-1">
          <MapPin className="w-3 h-3 text-primary" />
          <span className="text-muted-foreground">Restaurants</span>
        </div>
      </div>
    </Card>
  );
};

export default InteractiveMap;