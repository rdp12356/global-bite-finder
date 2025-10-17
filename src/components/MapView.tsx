import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import { NearbyRestaurant } from '@/hooks/useNearbyRestaurants';

const token = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;
if (token) {
  mapboxgl.accessToken = token as string;
}

interface MapViewProps {
  center?: { lat: number; lng: number };
  restaurants: NearbyRestaurant[];
}

export default function MapView({ center, restaurants }: MapViewProps) {
  if (!token) {
    return null;
  }
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center ? [center.lng, center.lat] : [0, 0],
      zoom: center ? 13 : 1,
    });
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (center) {
      map.setCenter([center.lng, center.lat]);
      map.setZoom(13);
    }
  }, [center]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    restaurants.forEach((r) => {
      if (!r.location) return;
      const el = document.createElement('div');
      el.className = 'w-3.5 h-3.5 rounded-full bg-primary ring-2 ring-white shadow-md';
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([r.location.lng, r.location.lat])
        .setPopup(new mapboxgl.Popup({ offset: 12 }).setHTML(`<div><strong>${r.name}</strong><br/>⭐ ${r.rating ?? 'N/A'}</div>`))
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, [restaurants]);

  return <div ref={mapContainer} className="w-full h-[420px] rounded-lg border" />;
}
