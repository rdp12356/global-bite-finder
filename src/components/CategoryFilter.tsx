import { Button } from "@/components/ui/button";

const categories = [
  "All Cuisines",
  "Japanese",
  "Italian", 
  "Mexican",
  "Indian",
  "Mediterranean",
  "French",
  "Thai",
  "Chinese",
  "Korean",
];

const CategoryFilter = () => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <Button
          key={category}
          variant={category === "All Cuisines" ? "default" : "outline"}
          className="whitespace-nowrap"
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
