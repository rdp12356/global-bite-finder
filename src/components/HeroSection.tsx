import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-food.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
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
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Discover World Flavors
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore new restaurants and international cuisines near you
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="flex gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Enter your location..." 
              className="pl-10 h-12 bg-card/50 backdrop-blur-sm border-border"
            />
          </div>
          <Button size="lg" className="h-12 px-8 shadow-[var(--shadow-warm)]">
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
