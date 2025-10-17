import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ChefHat, Flame, Leaf, Heart, Star } from 'lucide-react';
import { toast } from 'sonner';

const Preferences = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cuisines, setCuisines] = useState<any[]>([]);
  const [preferences, setPreferences] = useState<any>({
    isVegetarian: false,
    isVegan: false,
    spiceLevel: 3,
    priceRange: 2,
    selectedCuisines: new Map(),
    dietaryRestrictions: [],
    favoriteIngredients: [],
    dislikedIngredients: []
  });

  const cuisineOptions = [
    { id: 'italian', name: 'Italian', emoji: '🍝', description: 'Pizza, pasta, and Mediterranean flavors' },
    { id: 'japanese', name: 'Japanese', emoji: '🍣', description: 'Sushi, ramen, and authentic Japanese cuisine' },
    { id: 'chinese', name: 'Chinese', emoji: '🥢', description: 'Traditional and modern Chinese dishes' },
    { id: 'indian', name: 'Indian', emoji: '🍛', description: 'Spicy curries and aromatic spices' },
    { id: 'mexican', name: 'Mexican', emoji: '🌮', description: 'Tacos, burritos, and vibrant flavors' },
    { id: 'thai', name: 'Thai', emoji: '🍜', description: 'Sweet, sour, and spicy Thai cuisine' },
    { id: 'french', name: 'French', emoji: '🥐', description: 'Classic French cooking and pastries' },
    { id: 'mediterranean', name: 'Mediterranean', emoji: '🫒', description: 'Fresh, healthy Mediterranean dishes' },
    { id: 'american', name: 'American', emoji: '🍔', description: 'Classic American comfort food' },
    { id: 'korean', name: 'Korean', emoji: '🍲', description: 'Korean BBQ and fermented flavors' }
  ];

  const dietaryOptions = [
    'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Kosher', 'Halal', 'Keto', 'Low-Carb', 'Paleo'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // For now, we'll use local storage to persist preferences
      const savedPrefs = localStorage.getItem(`preferences_${user.id}`);
      if (savedPrefs) {
        const parsed = JSON.parse(savedPrefs);
        setPreferences({
          ...preferences,
          ...parsed,
          selectedCuisines: new Map(parsed.selectedCuisines || [])
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    try {
      // Save to localStorage for now
      const prefsToSave = {
        ...preferences,
        selectedCuisines: Array.from(preferences.selectedCuisines.entries())
      };
      localStorage.setItem(`preferences_${user.id}`, JSON.stringify(prefsToSave));
      
      toast.success('Preferences saved! Your recommendations will be personalized.');
    } catch (error) {
      toast.error('Error saving preferences');
    }

    setSaving(false);
  };

  const toggleCuisine = (cuisineId: string, level: number) => {
    const newMap = new Map(preferences.selectedCuisines);
    if (newMap.has(cuisineId)) {
      newMap.delete(cuisineId);
    } else {
      newMap.set(cuisineId, level);
    }
    setPreferences({ ...preferences, selectedCuisines: newMap });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold">Taste Preferences</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Help us personalize your restaurant recommendations
          </p>
        </div>

        <div className="space-y-8">
          {/* Dietary Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-500" />
                Dietary Preferences
              </CardTitle>
              <CardDescription>Tell us about your dietary needs and restrictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="vegetarian" className="text-base font-medium">Vegetarian</Label>
                    <p className="text-sm text-muted-foreground">No meat or fish</p>
                  </div>
                  <Switch
                    id="vegetarian"
                    checked={preferences.isVegetarian}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, isVegetarian: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="vegan" className="text-base font-medium">Vegan</Label>
                    <p className="text-sm text-muted-foreground">No animal products</p>
                  </div>
                  <Switch
                    id="vegan"
                    checked={preferences.isVegan}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, isVegan: checked })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-500" />
                    Spice Tolerance
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">How spicy do you like your food?</p>
                  <Slider
                    value={[preferences.spiceLevel]}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, spiceLevel: value[0] })
                    }
                    min={1}
                    max={5}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Mild</span>
                    <span className="font-medium">Level {preferences.spiceLevel}</span>
                    <span>Very Spicy</span>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Price Range</Label>
                  <p className="text-sm text-muted-foreground mb-3">What's your typical dining budget?</p>
                  <Slider
                    value={[preferences.priceRange]}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, priceRange: value[0] })
                    }
                    min={1}
                    max={4}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>$</span>
                    <span className="font-medium">{'$'.repeat(preferences.priceRange)}</span>
                    <span>$$$$</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Favorite Cuisines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Favorite Cuisines
              </CardTitle>
              <CardDescription>Select the cuisines you love most</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cuisineOptions.map((cuisine) => {
                  const isSelected = preferences.selectedCuisines.has(cuisine.id);
                  return (
                    <div
                      key={cuisine.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => toggleCuisine(cuisine.id, 5)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{cuisine.emoji}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{cuisine.name}</h3>
                            {isSelected && <Star className="w-4 h-4 text-primary fill-primary" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{cuisine.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Additional Dietary Restrictions */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Dietary Restrictions</CardTitle>
              <CardDescription>Any other dietary needs we should know about?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map((restriction) => (
                  <Badge
                    key={restriction}
                    variant={preferences.dietaryRestrictions.includes(restriction) ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1"
                    onClick={() => {
                      const current = preferences.dietaryRestrictions;
                      const updated = current.includes(restriction)
                        ? current.filter((r: string) => r !== restriction)
                        : [...current, restriction];
                      setPreferences({ ...preferences, dietaryRestrictions: updated });
                    }}
                  >
                    {restriction}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={handleSave} disabled={saving} className="flex-1 h-12">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Preferences'
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="h-12 px-8">
              Skip for Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
