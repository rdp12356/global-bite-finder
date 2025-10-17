import { Star, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RestaurantCardProps {
  name: string;
  cuisine: string;
  rating: number;
  distance: string;
  image: string;
  isNew?: boolean;
}

const RestaurantCard = ({ name, cuisine, rating, distance, image, isNew }: RestaurantCardProps) => {
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
      </div>
    </Card>
  );
};

export default RestaurantCard;
