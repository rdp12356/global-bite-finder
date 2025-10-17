import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
    selectedCuisines: new Map(),
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user) return;

    // Fetch cuisines
    const { data: cuisinesData } = await supabase
      .from('cuisines')
      .select('*')
      .order('name');

    if (cuisinesData) {
      setCuisines(cuisinesData);
    }

    // Fetch user preferences
    const { data: prefsData } = await supabase
      .from('taste_preferences')
      .select('*')
      .eq('user_id', user.id);

    if (prefsData && prefsData.length > 0) {
      const selectedMap = new Map();
      prefsData.forEach((pref: any) => {
        selectedMap.set(pref.cuisine_id, pref.preference_level);
      });

      setPreferences({
        isVegetarian: prefsData[0].is_vegetarian,
        isVegan: prefsData[0].is_vegan,
        spiceLevel: prefsData[0].spice_level,
        selectedCuisines: selectedMap,
      });
    }

    setLoading(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    // Delete existing preferences
    await supabase
      .from('taste_preferences')
      .delete()
      .eq('user_id', user.id);

    // Insert new preferences
    const prefsToInsert = Array.from(preferences.selectedCuisines.entries()).map(
      ([cuisineId, level]) => ({
        user_id: user.id,
        cuisine_id: cuisineId,
        preference_level: level,
        is_vegetarian: preferences.isVegetarian,
        is_vegan: preferences.isVegan,
        spice_level: preferences.spiceLevel,
      })
    );

    if (prefsToInsert.length > 0) {
      const { error } = await supabase
        .from('taste_preferences')
        .insert(prefsToInsert);

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error saving preferences',
          description: error.message,
        });
      } else {
        toast({
          title: 'Preferences saved!',
          description: 'Your taste profile has been updated.',
        });
      }
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
        <h1 className="text-4xl font-bold mb-8">Taste Preferences</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dietary Preferences</CardTitle>
              <CardDescription>Tell us about your dietary needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="vegetarian">Vegetarian</Label>
                <Switch
                  id="vegetarian"
                  checked={preferences.isVegetarian}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, isVegetarian: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="vegan">Vegan</Label>
                <Switch
                  id="vegan"
                  checked={preferences.isVegan}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, isVegan: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Spice Tolerance (1-5)</Label>
                <Slider
                  value={[preferences.spiceLevel]}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, spiceLevel: value[0] })
                  }
                  min={1}
                  max={5}
                  step={1}
                />
                <p className="text-sm text-muted-foreground">
                  Level: {preferences.spiceLevel}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Favorite Cuisines</CardTitle>
              <CardDescription>Select cuisines you love</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {cuisines.map((cuisine) => (
                  <Button
                    key={cuisine.id}
                    variant={
                      preferences.selectedCuisines.has(cuisine.id)
                        ? 'default'
                        : 'outline'
                    }
                    onClick={() => toggleCuisine(cuisine.id, 5)}
                    className="justify-start"
                  >
                    {cuisine.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
