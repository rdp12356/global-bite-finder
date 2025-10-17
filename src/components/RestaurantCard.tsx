import { Star, MapPin, Heart, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface RestaurantCardProps {
  name: string;
  cuisine: string;
  rating: number;
  distance: string;
  image: string;
  isNew?: boolean;
  placeId?: string;
  reviewSnippet?: string;
}

const RestaurantCard = ({ name, cuisine, rating, distance, image, isNew, placeId, reviewSnippet }: RestaurantCardProps) => {
  const [saved, setSaved] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const toggleFavorite = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Please sign in', description: 'Sign in to save favorites.' });
      return;
    }
    try {
      // Upsert restaurant by place_id if available
      let restaurantId: string | null = null;
      if (placeId) {
        const upsertRes = await supabase
          .from('restaurants')
          .upsert({ place_id: placeId, name, rating, photo_url: image }, { onConflict: 'place_id' })
          .select('id')
          .single();
        if (!upsertRes.error && upsertRes.data) {
          restaurantId = (upsertRes.data as any).id;
        }
      }
      if (!restaurantId) {
        // fallback create minimal record
        const insertRes = await supabase
          .from('restaurants')
          .insert({ place_id: placeId || null, name, rating, photo_url: image })
          .select('id')
          .single();
        if (!insertRes.error && insertRes.data) {
          restaurantId = (insertRes.data as any).id;
        }
      }

      if (!restaurantId) throw new Error('Unable to save restaurant');

      if (!saved) {
        await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, restaurant_id: restaurantId });
        setSaved(true);
        toast({ title: 'Saved', description: `${name} added to favorites.` });
      } else {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('restaurant_id', restaurantId);
        setSaved(false);
        toast({ title: 'Removed', description: `${name} removed from favorites.` });
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e?.message || 'Could not update favorite' });
    }
  };

  const sharePlace = async () => {
    const url = placeId ? `https://www.google.com/maps/place/?q=place_id:${placeId}` : window.location.href;
    const shareData = { title: name, text: `${name} — ${cuisine} ⭐ ${rating}`, url } as any;
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: 'Link copied', description: 'Place link copied to clipboard.' });
      }
    } catch {}
  };
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
        <div className="absolute top-3 left-3 flex gap-2">
          <Button
            variant={saved ? "secondary" : "outline"}
            size="icon"
            className="backdrop-blur bg-background/70 border-white/30"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite();
            }}
            aria-label="Favorite"
          >
            <Heart className={saved ? "fill-accent text-accent" : ""} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="backdrop-blur bg-background/70 border-white/30"
            onClick={(e) => {
              e.stopPropagation();
              sharePlace();
            }}
            aria-label="Share"
          >
            <Share2 />
          </Button>
        </div>
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
        {reviewSnippet && (
          <p className="text-xs text-muted-foreground line-clamp-2">“{reviewSnippet}”</p>
        )}
      </div>
    </Card>
  );
};

export default RestaurantCard;
