import { Search, MapPin, Loader2, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import heroImage from "@/assets/hero-food.jpg";

const HeroSection = () => {
  const { latitude, longitude, error, loading } = useGeolocation();
  const [locationText, setLocationText] = useState("Enter your location...");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  useEffect(() => {
    if (latitude && longitude) {
      // Reverse geocoding to get address
      reverseGeocode(latitude, longitude);
    } else if (error) {
      toast.error("Location access denied. Please enter your location manually.");
    }
  }, [latitude, longitude, error]);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
      const data = await response.json();
      setLocationText(data.city || data.locality || `${lat.toFixed(2)}, ${lng.toFixed(2)}`);
      toast.success("Location detected successfully!");
    } catch (error) {
      setLocationText(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
    }
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        reverseGeocode(position.coords.latitude, position.coords.longitude);
        setIsDetectingLocation(false);
      },
      (error) => {
        toast.error("Unable to detect location. Please enter manually.");
        setIsDetectingLocation(false);
      }
    );
  };

  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Delicious international cuisine" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-in slide-in-from-top duration-1000">
            Taste the World Near You
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-in slide-in-from-bottom duration-1000 delay-300">
            Discover amazing restaurants and international cuisines with personalized recommendations just for you
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto animate-in slide-in-from-bottom duration-1000 delay-500">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder={locationText}
              value={locationText === "Enter your location..." ? "" : locationText}
              onChange={(e) => setLocationText(e.target.value)}
              className="pl-10 h-14 text-lg bg-card/80 backdrop-blur-sm border-border focus:bg-card/90 transition-all"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDetectLocation}
              disabled={isDetectingLocation || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-3"
            >
              {isDetectingLocation || loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button size="lg" className="h-14 px-8 text-lg shadow-[var(--shadow-warm)] hover:shadow-xl transition-all">
            <Search className="w-5 h-5 mr-2" />
            Discover Restaurants
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 animate-in slide-in-from-bottom duration-1000 delay-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">1000+</div>
            <div className="text-sm text-muted-foreground">Restaurants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">50+</div>
            <div className="text-sm text-muted-foreground">Cuisines</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-secondary">4.8★</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
