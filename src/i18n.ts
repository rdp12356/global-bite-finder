import { createContext, useContext, useMemo, useState, ReactNode } from 'react';

type Locale = 'en' | 'es' | 'fr' | 'hi' | 'ja';

type Messages = Record<string, string>;

const DICTIONARIES: Record<Locale, Messages> = {
  en: {
    tagline: 'Taste the World Near You',
    discover_world_flavors: 'Discover World Flavors',
    explore_nearby: 'Explore new restaurants and international cuisines near you',
    new_restaurants: 'New Restaurants',
    just_opened: 'Just opened in your area',
    explore_cuisines: 'Explore International Cuisines',
    filter_favorites: 'Filter by your favorite cuisine type',
    sign_in: 'Sign In',
    sign_up: 'Sign Up',
  },
  es: {
    tagline: 'Prueba el mundo cerca de ti',
    discover_world_flavors: 'Descubre Sabores del Mundo',
    explore_nearby: 'Explora restaurantes y cocinas internacionales cerca de ti',
    new_restaurants: 'Nuevos Restaurantes',
    just_opened: 'Recién abiertos en tu zona',
    explore_cuisines: 'Explora Cocinas Internacionales',
    filter_favorites: 'Filtra por tu tipo de cocina favorita',
    sign_in: 'Iniciar sesión',
    sign_up: 'Crear cuenta',
  },
  fr: {
    tagline: 'Goûtez le monde près de vous',
    discover_world_flavors: 'Découvrez les Saveurs du Monde',
    explore_nearby: 'Explorez des restaurants et cuisines près de chez vous',
    new_restaurants: 'Nouveaux Restaurants',
    just_opened: 'Vient d’ouvrir près de chez vous',
    explore_cuisines: 'Explorer les Cuisines Internationales',
    filter_favorites: 'Filtrer par votre cuisine préférée',
    sign_in: 'Se connecter',
    sign_up: 'Créer un compte',
  },
  hi: {
    tagline: 'दुनिया का स्वाद आपके पास',
    discover_world_flavors: 'विश्व के स्वाद खोजें',
    explore_nearby: 'अपने पास नए रेस्तरां और अंतरराष्ट्रीय व्यंजन खोजें',
    new_restaurants: 'नए रेस्तरां',
    just_opened: 'आपके क्षेत्र में अभी-अभी खुले',
    explore_cuisines: 'अंतरराष्ट्रीय व्यंजन खोजें',
    filter_favorites: 'अपनी पसंदीदा रसोई के प्रकार से फ़िल्टर करें',
    sign_in: 'साइन इन',
    sign_up: 'साइन अप',
  },
  ja: {
    tagline: '世界の味をあなたの近くで',
    discover_world_flavors: '世界の味を見つける',
    explore_nearby: '近くのレストランと各国料理を探索',
    new_restaurants: '新規オープン',
    just_opened: 'あなたの地域で新しくオープン',
    explore_cuisines: '各国料理を探索',
    filter_favorites: '好きな料理タイプで絞り込み',
    sign_in: 'ログイン',
    sign_up: '登録',
  },
};

interface I18nContextValue {
  locale: Locale;
  t: (key: keyof typeof DICTIONARIES['en']) => string;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const messages = DICTIONARIES[locale];

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    setLocale,
    t: (key) => messages[key] ?? String(key),
  }), [locale, messages]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};

export const locales: Locale[] = ['en', 'es', 'fr', 'hi', 'ja'];
