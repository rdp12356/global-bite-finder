import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const staticCategories = ["All Cuisines"] as const;

const CategoryFilter = () => {
  const { data: cuisines } = useQuery({
    queryKey: ["cuisines"],
    queryFn: async () => {
      const { data } = await supabase.from("cuisines").select("id,name").order("name");
      return data ?? [];
    },
  });

  const categories = [
    ...staticCategories,
    ...(cuisines?.map((c: any) => c.name) ?? []),
  ];

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
