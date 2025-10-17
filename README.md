# 🍽️ Taste the World - Restaurant Discovery App

A beautiful, interactive, and lovable website that helps users discover new restaurants and explore international cuisines near their location.

![Taste the World](https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=400&fit=crop&crop=center)

## ✨ Features

### 🌐 Location-Based Discovery
- **Automatic location detection** using geolocation API
- **Nearby restaurant discovery** with distance calculations
- **Real-time updates** of available restaurants

### 🍣 International Cuisine Explorer
- **10+ cuisine types** including Italian, Japanese, Indian, Mexican, Thai, French, and more
- **Visual cuisine selection** with emojis and descriptions
- **Cuisine-specific filtering** and recommendations

### ⭐ Smart Recommendations
- **AI-powered recommendation engine** that learns from user behavior
- **Personalized "For You" section** based on taste preferences
- **Trending restaurants** with popularity algorithms
- **Behavioral learning** from favorites, visits, and ratings

### 🔐 User Authentication
- **Google OAuth integration** for seamless sign-in
- **Apple Sign-In support** for iOS users
- **Secure user profiles** with Supabase backend
- **Guest browsing** with limited features

### 💖 Personalization System
- **Comprehensive taste profile** setup
- **Dietary preferences** (Vegetarian, Vegan, Gluten-free, etc.)
- **Spice tolerance levels** (1-5 scale)
- **Price range preferences** ($-$$$$)
- **Cuisine favorites** with visual selection
- **Dietary restrictions** management

### 🗺️ Interactive Features
- **Interactive map view** with restaurant markers
- **Cuisine-coded markers** for easy identification
- **Restaurant info windows** with key details
- **Map/Grid view toggle** for different browsing experiences

### ❤️ Social Features
- **Favorites system** with persistent storage
- **Share functionality** for restaurants and favorite lists
- **Social media integration** for sharing discoveries
- **Review and rating system** (planned)

### 🎨 Modern UI/UX
- **Beautiful gradient designs** with warm color schemes
- **Smooth animations** and hover effects
- **Responsive design** for all device sizes
- **Dark/Light mode toggle** with system preference detection
- **Accessibility-first** design principles

### 🌍 Global Support
- **Multilingual interface** (English, Spanish, French, Italian, Japanese, Chinese)
- **Currency localization** for price displays
- **Cultural cuisine preferences** by region

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development
- **Tailwind CSS** for utility-first styling
- **Shadcn/ui** for beautiful, accessible components
- **Framer Motion** for smooth animations
- **React Router** for client-side routing

### Backend & Services
- **Supabase** for authentication and database
- **Google Places API** for restaurant data
- **Google Maps API** for mapping functionality
- **Geolocation API** for location detection

### State Management
- **React Query** for server state management
- **Context API** for global state
- **Local Storage** for preferences persistence

### Development Tools
- **ESLint** for code quality
- **TypeScript** for type safety
- **Prettier** for code formatting
- **Git** for version control

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Google Maps API key
- Supabase project (optional, has fallbacks)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd taste-the-world
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Google Maps & Places API (Required for full functionality)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Supabase (Optional - app works with local storage fallback)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Food delivery APIs (Future enhancement)
VITE_ZOMATO_API_KEY=your_zomato_api_key
VITE_UBER_EATS_API_KEY=your_uber_eats_api_key
VITE_DOORDASH_API_KEY=your_doordash_api_key
```

### 4. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 5. Build for Production
```bash
npm run build
```

## 🔑 API Keys Setup

### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the key to your domains for security

### Supabase Setup (Optional)
1. Create account at [Supabase](https://supabase.com)
2. Create new project
3. Get your project URL and anon key
4. Set up authentication providers (Google, Apple)

## 📱 Features Walkthrough

### 🏠 Home Page
- **Hero section** with location detection
- **Trending restaurants** carousel
- **Personalized recommendations** (when logged in)
- **Cuisine filter** with visual selection
- **Map/Grid toggle** for different views

### 🔐 Authentication
- **Social login** with Google/Apple
- **Email/password** fallback
- **Guest mode** for browsing
- **Profile management**

### ⚙️ Preferences
- **Dietary restrictions** setup
- **Spice tolerance** slider
- **Price range** preferences
- **Favorite cuisines** selection
- **AI learning** from choices

### ❤️ Favorites
- **Save restaurants** for later
- **Organized collections**
- **Share favorite lists**
- **Personalized recommendations** based on favorites

### 🗺️ Map View
- **Interactive restaurant map**
- **Cuisine-coded markers**
- **Info windows** with details
- **User location** indicator

## 🎯 AI Recommendation System

The app features a sophisticated recommendation engine that:

### Learning Mechanisms
- **Cuisine preferences** from user selections
- **Behavioral patterns** from favorites and visits
- **Rating history** for preference learning
- **Search patterns** for interest detection

### Recommendation Types
- **Personalized**: Based on user taste profile
- **Trending**: Popular restaurants with high engagement
- **Similar**: Restaurants similar to user favorites
- **Discovery**: New cuisines to explore

### Scoring Algorithm
- **Base rating** (30% weight)
- **Cuisine match** (25% weight)
- **Dietary compatibility** (20% weight)
- **Price compatibility** (10% weight)
- **Behavioral signals** (15% weight)

## 🌟 Design Philosophy

### User Experience
- **Delight-first** approach with smooth animations
- **Discovery-focused** interface encouraging exploration
- **Accessibility** as a core principle
- **Performance** optimized for all devices

### Visual Design
- **Warm color palette** evoking food and comfort
- **Food photography** as hero elements
- **Clean typography** for readability
- **Consistent spacing** and visual hierarchy

### Interaction Design
- **Intuitive navigation** with clear CTAs
- **Smooth transitions** between states
- **Immediate feedback** for all actions
- **Progressive disclosure** of information

## 🚧 Future Enhancements

### Planned Features
- **Real-time reviews** integration with Google Reviews
- **Food delivery** API integrations (Uber Eats, DoorDash)
- **Restaurant booking** system
- **Social features** with friend recommendations
- **AR menu** scanning and translation
- **Voice search** and commands
- **Offline mode** with cached data

### Technical Improvements
- **PWA** capabilities for mobile installation
- **Push notifications** for new restaurants
- **Advanced caching** strategies
- **Performance monitoring** and analytics
- **A/B testing** framework

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for beautiful component library
- **Unsplash** for stunning food photography
- **Google** for Maps and Places APIs
- **Supabase** for backend infrastructure
- **React community** for excellent tooling

---

**Built with ❤️ for food lovers everywhere** 🌍🍽️

*Taste the World Near You* - Discover, Explore, Enjoy!