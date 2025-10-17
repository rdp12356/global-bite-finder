import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

interface MapViewProps {
  restaurants: Array<{ id: string; name: string; latitude: number; longitude: number; }>;
  center?: { latitude: number; longitude: number } | null;
}

const MapView = ({ restaurants, center }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    const lng = center?.longitude ?? 0;
    const lat = center?.latitude ?? 0;
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: center ? 12 : 2,
    });
  }, [center]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const markers: mapboxgl.Marker[] = [];
    restaurants.forEach((r) => {
      if (typeof r.longitude !== 'number' || typeof r.latitude !== 'number') return;
      const marker = new mapboxgl.Marker()
        .setLngLat([r.longitude, r.latitude])
        .setPopup(new mapboxgl.Popup({ offset: 16 }).setText(r.name))
        .addTo(map);
      markers.push(marker);
    });
    return () => markers.forEach((m) => m.remove());
  }, [restaurants]);

  return (
    <div className="w-full h-[360px] rounded-xl overflow-hidden border" ref={mapContainer} />
  );
};

export default MapView;
