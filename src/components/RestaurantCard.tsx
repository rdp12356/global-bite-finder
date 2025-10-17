import { Star, MapPin, Heart, Clock, DollarSign, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { recommendationEngine } from "@/services/recommendations";
import { toast } from "sonner";

interface RestaurantCardProps {
  id?: string;
  name: string;
  cuisine: string;
  rating: number;
  distance: string;
  image: string;
  address?: string;
  isNew?: boolean;
  isOpen?: boolean;
  priceLevel?: number;
  popularDishes?: string[];
}

const RestaurantCard = ({ 
  id, 
  name, 
  cuisine, 
  rating, 
  distance, 
  image, 
  address,
  isNew, 
  isOpen, 
  priceLevel,
  popularDishes = []
}: RestaurantCardProps) => {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (user && id) {
      // Check if restaurant is already favorited
      const favorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`) || '[]');
      setIsFavorited(favorites.includes(id));
    }
  }, [user, id]);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please sign in to save favorites");
      return;
    }

    if (!id) return;

    if (isFavorited) {
      recommendationEngine.removeFavorite(user.id, id);
      setIsFavorited(false);
      toast.success("Removed from favorites");
    } else {
      recommendationEngine.recordUserInteraction(user.id, id, 'favorite');
      setIsFavorited(true);
      toast.success("Added to favorites");
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: name,
        text: `Check out ${name} - ${cuisine}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`${name} - ${cuisine} at ${address}`);
      toast.success("Restaurant details copied to clipboard!");
    }
  };

  const getPriceSymbol = (level?: number) => {
    if (!level) return '';
    return '$'.repeat(level);
  };

  return (
    <Card className="group overflow-hidden border-border hover:shadow-[var(--shadow-warm)] transition-all duration-300 cursor-pointer hover:-translate-y-1">
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        
        {/* Top badges and actions */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex gap-2">
            {isNew && (
              <Badge className="bg-primary text-primary-foreground shadow-lg animate-pulse">
                New
              </Badge>
            )}
            {isOpen !== undefined && (
              <Badge variant={isOpen ? "default" : "secondary"} className="shadow-lg">
                <Clock className="w-3 h-3 mr-1" />
                {isOpen ? "Open" : "Closed"}
              </Badge>
            )}
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavorite}
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            >
              <Share2 className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </h3>
            {priceLevel && (
              <span className="text-sm font-medium text-muted-foreground flex items-center">
                <DollarSign className="w-3 h-3" />
                {getPriceSymbol(priceLevel)}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-1">{cuisine}</p>
          {address && (
            <p className="text-xs text-muted-foreground line-clamp-1">{address}</p>
          )}
        </div>
        
        {/* Popular dishes */}
        {popularDishes.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Popular dishes:</p>
            <div className="flex flex-wrap gap-1">
              {popularDishes.slice(0, 3).map((dish, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                  {dish}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-medium text-foreground">{rating}</span>
            <span className="text-muted-foreground">({Math.floor(Math.random() * 200) + 50} reviews)</span>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{distance}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCard;
