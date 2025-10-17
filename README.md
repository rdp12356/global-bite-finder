# Taste the World - Restaurant Discovery App

A beautiful, interactive, and lovable website that helps users discover new restaurants and explore international cuisines near their location.

## 🌟 Features

### Core Functionality
- 🌐 **Automatic Location Detection** - Shows newly opened and available restaurants nearby
- 🍣 **International Cuisines** - Italian, Japanese, Indian, Mexican, Thai, French, and more
- ⭐ **Reviews & Ratings** - Star ratings, customer feedback, and popular dishes
- 🗺️ **Interactive Map View** - Real-time updates of nearby restaurants
- 💖 **Personalized Recommendations** - Based on taste preferences and dining history

### User Experience
- ✨ **Modern UI** - Beautiful visuals with smooth animations
- 💬 **"For You" Section** - Handpicked recommendations based on taste profile
- 🌈 **Dark Mode** - Full dark mode support
- 🌍 **Multilingual Support** - Multiple language options
- 📱 **Responsive Design** - Works perfectly on all devices

### Backend & AI
- 🧠 **Google Places API** - Live restaurant data
- 🤖 **AI Recommendations** - Smart suggestions based on user behavior
- 🔐 **Authentication** - Google/Apple login with taste profile customization
- 💾 **User Preferences** - Learn and adapt to user tastes over time

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Maps API key
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taste-the-world
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your API keys in `.env.local`:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Maps**: Google Maps API
- **Authentication**: NextAuth.js
- **State Management**: React Hooks + SWR
- **Icons**: Lucide React
- **Theme**: next-themes

## 📁 Project Structure

```
taste-the-world/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth-provider.tsx  # Authentication context
│   ├── cuisine-section.tsx # Cuisine selection
│   ├── footer.tsx         # Footer component
│   ├── header.tsx         # Header with navigation
│   ├── hero.tsx           # Hero section
│   ├── map-view.tsx       # Interactive map
│   ├── restaurant-card.tsx # Restaurant card
│   ├── restaurant-grid.tsx # Restaurant listings
│   └── theme-provider.tsx # Theme context
├── hooks/                 # Custom React hooks
│   ├── use-location.ts    # Location detection
│   └── use-restaurants.ts # Restaurant data
├── types/                 # TypeScript types
│   └── restaurant.ts      # Restaurant interfaces
└── public/               # Static assets
```

## 🎨 Design Features

- **Gradient Backgrounds** - Beautiful color gradients throughout
- **Smooth Animations** - Framer Motion for delightful interactions
- **Card-based Layout** - Clean, modern card design
- **Responsive Grid** - Adapts to all screen sizes
- **Interactive Elements** - Hover effects and micro-interactions
- **Loading States** - Elegant loading animations
- **Error Handling** - User-friendly error messages

## 🔧 Configuration

### Google Maps API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the Maps JavaScript API
3. Create an API key
4. Add it to your `.env.local` file

### Authentication Setup (Optional)
1. Set up Google OAuth in Google Cloud Console
2. Add client ID and secret to `.env.local`
3. Configure NextAuth.js settings

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide React](https://lucide.dev/) - Beautiful icons
- [Unsplash](https://unsplash.com/) - Beautiful food photography

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact us at hello@tastetheworld.com

---

**Taste the World Near You** - Discover amazing restaurants and explore international cuisines! 🌍🍽️