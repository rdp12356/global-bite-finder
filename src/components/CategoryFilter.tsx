import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const cuisines = [
  { name: "Italian", emoji: "🍝", color: "bg-red-100 text-red-800" },
  { name: "Japanese", emoji: "🍣", color: "bg-orange-100 text-orange-800" },
  { name: "Chinese", emoji: "🥢", color: "bg-yellow-100 text-yellow-800" },
  { name: "Indian", emoji: "🍛", color: "bg-orange-100 text-orange-800" },
  { name: "Mexican", emoji: "🌮", color: "bg-green-100 text-green-800" },
  { name: "Thai", emoji: "🍜", color: "bg-green-100 text-green-800" },
  { name: "French", emoji: "🥐", color: "bg-purple-100 text-purple-800" },
  { name: "Mediterranean", emoji: "🫒", color: "bg-blue-100 text-blue-800" },
  { name: "American", emoji: "🍔", color: "bg-gray-100 text-gray-800" },
  { name: "Korean", emoji: "🍲", color: "bg-pink-100 text-pink-800" },
];

interface CategoryFilterProps {
  onCuisineSelect?: (cuisine: string) => void;
  selectedCuisine?: string;
}

const CategoryFilter = ({ onCuisineSelect, selectedCuisine }: CategoryFilterProps) => {
  return (
    <div className="space-y-4">
      {/* All Cuisines Button */}
      <div className="flex justify-center">
        <Button
          variant={!selectedCuisine ? "default" : "outline"}
          onClick={() => onCuisineSelect?.('')}
          className="px-6"
        >
          All Cuisines
        </Button>
      </div>

      {/* Cuisine Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-3">
        {cuisines.map((cuisine) => (
          <Button
            key={cuisine.name}
            variant={selectedCuisine === `${cuisine.name} Cuisine` ? "default" : "outline"}
            onClick={() => onCuisineSelect?.(`${cuisine.name} Cuisine`)}
            className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
          >
            <span className="text-2xl">{cuisine.emoji}</span>
            <span className="text-sm font-medium">{cuisine.name}</span>
          </Button>
        ))}
      </div>

      {/* Popular Filters */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
          🔥 Trending
        </Badge>
        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
          ⭐ Top Rated
        </Badge>
        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
          💰 Budget Friendly
        </Badge>
        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
          🚀 Fast Delivery
        </Badge>
      </div>
    </div>
  );
};

export default CategoryFilter;
