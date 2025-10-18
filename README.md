# Zertainity.com

**Choose with Confidence — Your AI Mentor for Smarter Academic Choices**

Zertainity is a full-stack AI-driven educational guidance platform that helps students make informed decisions about their academic future. It combines academic performance analysis, aptitude testing, AI-powered coaching, and personalized recommendations to guide students toward the right stream and college.

## 🎯 Features

### 1. Smart Marks Analysis
- **Manual Entry**: Students can enter their marks subject-wise
- **OCR Upload**: Upload marksheet images for automatic mark extraction
- **Performance Analysis**: AI analyzes academic strengths and weaknesses

### 2. Dual Aptitude Tests
- **Logical Reasoning**: 8 adaptive questions testing analytical thinking
- **Interest Profiling**: 8 questions to understand career preferences
- **Adaptive Difficulty**: Questions adjust based on performance

### 3. AI Career Coach
- **Natural Conversation**: Chat with an AI mentor about aspirations
- **Emotional Analysis**: Detects stress levels and emotional tone
- **Personalized Guidance**: Tailored advice based on student profile

### 4. Personalized Recommendations
- **Stream Suggestions**: AI-recommended Class 11 streams (Science, Commerce, Arts)
- **College Recommendations**: Suitable colleges and courses for Class 12
- **Detailed Analysis**: Pros, cons, and reasoning for each recommendation

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express (ready for implementation)
- **Database**: Supabase (PostgreSQL)
- **AI APIs**: OpenRouter or Groq API
- **OCR**: Tesseract.js
- **Auth**: Google SSO (Supabase Auth)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- AI API key (OpenRouter or Groq)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zertainity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_AI_API_KEY=your_ai_api_key
   ```

4. **Set up Supabase database**
   - Run the migration file: `supabase/migrations/20250117000000_zertainity_schema.sql`
   - Enable Google OAuth in Supabase Auth settings

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── lib/                # Utility functions
├── pages/              # Main application pages
│   ├── HomePage.tsx    # Landing page
│   ├── Dashboard.tsx   # User dashboard
│   ├── MarksInput.tsx  # Marks entry and OCR
│   ├── AptitudeTest.tsx # Aptitude testing
│   ├── AICoach.tsx     # AI chat interface
│   └── Recommendations.tsx # Results and suggestions
└── App.tsx             # Main app component
```

## 🧠 AI Integration

The platform uses AI in multiple ways:

1. **OCR Processing**: Tesseract.js for marksheet text extraction
2. **Conversation Analysis**: AI coach analyzes emotional tone and stress levels
3. **Recommendation Engine**: AI processes academic data, aptitude results, and interests
4. **Personalized Insights**: Custom explanations for each recommendation

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with gradient accents
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Animations**: Smooth Framer Motion animations for better UX
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Dark Mode**: Ready for theme switching (future enhancement)

## 🔒 Security & Privacy

- **Row Level Security**: Supabase RLS policies protect user data
- **Secure Authentication**: Google OAuth with Supabase Auth
- **Data Encryption**: All sensitive data encrypted in transit and at rest
- **Privacy First**: No unnecessary data collection

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Set Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure production URLs are configured

3. **Deploy**
   ```bash
   vercel --prod
   ```

## 📊 Database Schema

The platform uses a comprehensive PostgreSQL schema with tables for:
- User profiles and authentication
- Academic subjects and marks
- Aptitude questions and results
- AI conversations and analysis
- Streams, colleges, and courses
- Personalized recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@zertainity.com or join our Discord community.

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Parent/teacher portal
- [ ] Integration with school management systems
- [ ] Multi-language support
- [ ] Advanced AI features (GPT-4, Claude)

---

**Built with ❤️ for students making important academic decisions**