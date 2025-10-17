import HeroSection from "@/components/HeroSection";
import CategoryFilter from "@/components/CategoryFilter";
import RestaurantCard from "@/components/RestaurantCard";
import restaurant1 from "@/assets/restaurant-1.jpg";
import restaurant2 from "@/assets/restaurant-2.jpg";
import restaurant3 from "@/assets/restaurant-3.jpg";
import restaurant4 from "@/assets/restaurant-4.jpg";
import restaurant5 from "@/assets/restaurant-5.jpg";
import restaurant6 from "@/assets/restaurant-6.jpg";

const Index = () => {
  const newRestaurants = [
    {
      name: "Sakura Sushi Bar",
      cuisine: "Japanese Cuisine",
      rating: 4.8,
      distance: "0.5 km",
      image: restaurant1,
      isNew: true,
    },
    {
      name: "La Cucina Italiana",
      cuisine: "Italian Cuisine",
      rating: 4.7,
      distance: "1.2 km",
      image: restaurant2,
      isNew: true,
    },
    {
      name: "Taco Fiesta",
      cuisine: "Mexican Cuisine",
      rating: 4.6,
      distance: "0.8 km",
      image: restaurant3,
      isNew: true,
    },
  ];

  const allRestaurants = [
    {
      name: "Spice Route",
      cuisine: "Indian Cuisine",
      rating: 4.9,
      distance: "1.5 km",
      image: restaurant4,
    },
    {
      name: "Mykonos Taverna",
      cuisine: "Mediterranean Cuisine",
      rating: 4.7,
      distance: "2.1 km",
      image: restaurant5,
    },
    {
      name: "Café Parisien",
      cuisine: "French Cuisine",
      rating: 4.8,
      distance: "1.8 km",
      image: restaurant6,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* New Restaurants */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              New Restaurants
            </h2>
            <p className="text-muted-foreground">
              Just opened in your area
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.name} {...restaurant} />
            ))}
          </div>
        </section>

        {/* Explore Cuisines */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Explore International Cuisines
            </h2>
            <p className="text-muted-foreground mb-6">
              Filter by your favorite cuisine type
            </p>
            <CategoryFilter />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.name} {...restaurant} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
