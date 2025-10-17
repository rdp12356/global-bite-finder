import { Star, MapPin, Heart, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RestaurantCardProps {
  id?: string;
  name: string;
  cuisine: string;
  rating: number;
  distance: string;
  image: string;
  isNew?: boolean;
  isFavorite?: boolean;
  onFavorite?: () => void;
}

const RestaurantCard = ({ id, name, cuisine, rating, distance, image, isNew, isFavorite, onFavorite }: RestaurantCardProps) => {
  return (
    <Card className="group overflow-hidden border-border hover:shadow-[var(--shadow-warm)] transition-all duration-300 cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        {isNew && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground shadow-lg">
            New
          </Badge>
        )}
      </div>
      
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">{cuisine}</p>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="font-medium text-foreground">{rating}</span>
          </div>
          
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{distance}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant={isFavorite ? "default" : "outline"}
            size="icon"
            aria-label="Favorite"
            onClick={(e) => {
              e.preventDefault();
              onFavorite?.();
            }}
          >
            <Heart className={"w-4 h-4 " + (isFavorite ? "text-primary" : "")} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Share"
            onClick={(e) => {
              e.preventDefault();
              if (navigator.share) {
                navigator.share({ title: name, text: `${name} • ${cuisine}`, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCard;
