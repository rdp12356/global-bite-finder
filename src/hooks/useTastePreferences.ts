import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { TastePreferences } from '@/lib/recommendations';

interface UseTastePreferencesResult {
  prefs: TastePreferences | null;
  loading: boolean;
}

export function useTastePreferences(): UseTastePreferencesResult {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['taste-preferences', user?.id],
    enabled: !!user,
    queryFn: async () => {
      // Fetch cuisines and user taste prefs
      const [{ data: cuisines }, { data: prefs }] = await Promise.all([
        supabase.from('cuisines').select('*').order('name'),
        supabase.from('taste_preferences').select('*').eq('user_id', user!.id),
      ]);

      const nameToLevel = new Map<string, number>();
      if (cuisines && prefs) {
        for (const pref of prefs) {
          const cuisine = cuisines.find((c) => c.id === (pref as any).cuisine_id);
          if (cuisine) {
            nameToLevel.set(cuisine.name, (pref as any).preference_level || 5);
          }
        }
      }

      const preferences: TastePreferences = {
        isVegetarian: prefs?.[0]?.is_vegetarian ?? false,
        isVegan: prefs?.[0]?.is_vegan ?? false,
        spiceLevel: prefs?.[0]?.spice_level ?? 3,
        preferredCuisineNames: nameToLevel,
      };

      return preferences;
    },
  });

  return { prefs: data ?? null, loading: isLoading };
}
