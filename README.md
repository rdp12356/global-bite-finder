# Zertainity.com - AI-Powered Educational Guidance Platform

**Choose with Confidence — Your AI Mentor for Smarter Academic Choices**

Zertainity is a comprehensive AI-driven educational guidance platform that helps students make informed decisions about their academic future. By analyzing academic performance, conducting aptitude tests, and providing personalized AI coaching, Zertainity guides students toward the right stream and college choices.

## 🎯 Core Features

### 1. Smart Marks Analysis
- **Manual Entry**: Students can enter their marks manually with subject-wise breakdown
- **OCR Upload**: Upload marksheet images for automatic mark extraction using AI
- **Academic Insights**: AI analyzes performance patterns and identifies strengths

### 2. Dual Aptitude Testing
- **Logical Reasoning Test**: 8 questions covering verbal, numerical, spatial, and logical reasoning
- **Interest Profiling Test**: 8 questions to understand career preferences and work style
- **Adaptive Difficulty**: Questions adjust based on performance
- **Detailed Analytics**: Category-wise scoring and performance insights

### 3. AI Career Coach
- **Natural Conversation**: Interactive chat with AI mentor
- **Emotional Intelligence**: Detects stress levels and emotional tone
- **Personalized Guidance**: Tailored advice based on academic and aptitude data
- **Confidence Building**: Motivational support and stress management

### 4. Personalized Recommendations
- **Stream Recommendations**: AI-suggested Class 11 streams (Science, Commerce, Arts)
- **College Recommendations**: Top colleges matching academic profile
- **Match Scoring**: Confidence levels and reasoning for each recommendation
- **Career Paths**: Detailed career trajectories for each stream

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Radix UI** components
- **React Router** for navigation
- **React Hook Form** for form handling

### Backend
- **Node.js** with Express
- **CORS** for cross-origin requests
- **RESTful API** design

### Database
- **Supabase** (PostgreSQL)
- **Real-time subscriptions**
- **Row Level Security**

### AI & OCR
- **OpenRouter/Groq API** for AI conversations
- **Tesseract.js** for OCR processing
- **Custom recommendation algorithms**

### Authentication
- **Supabase Auth** with Google SSO
- **JWT tokens**
- **Secure user sessions**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zertainity
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase credentials and API keys.

4. **Run the development server**
   ```bash
   # Frontend (port 3000)
   npm run dev
   
   # Backend (port 3001)
   cd server && npm run dev
   ```

5. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration files in `supabase/migrations/`
   - Configure authentication providers

## 📁 Project Structure

```
zertainity/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── contexts/           # React contexts (Auth, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── integrations/       # External service integrations
├── server/                 # Express backend
├── supabase/              # Database migrations and config
└── public/                # Static assets
```

## 🎨 Key Pages

### HomePage (`/`)
- Hero section with value proposition
- Feature overview
- Process explanation
- Call-to-action buttons

### Marks Input (`/marks`)
- Manual marks entry form
- OCR upload interface
- Subject management
- Academic information form

### Aptitude Tests (`/aptitude`)
- Test selection interface
- Question navigation
- Timer and progress tracking
- Results summary

### AI Coach (`/ai-coach`)
- Chat interface
- Message history
- Emotional analysis
- Conversation insights

### Recommendations (`/recommendations`)
- Stream recommendations
- College suggestions
- Match scoring
- Detailed reasoning

### Profile (`/profile`)
- Personal information
- Academic performance
- Aptitude results
- Emotional insights

## 🔧 API Endpoints

### Health Check
```
GET /api/health
```

### OCR Processing
```
POST /api/ocr
Content-Type: multipart/form-data
Body: { file: marksheet_image }
```

### AI Recommendations
```
POST /api/recommendations
Body: {
  academicData: {...},
  aptitudeResults: {...},
  conversationInsights: {...}
}
```

## 🎯 User Journey

1. **Landing** → Student visits homepage
2. **Authentication** → Sign up/sign in with Google
3. **Marks Input** → Enter academic performance data
4. **Aptitude Testing** → Complete logical and interest tests
5. **AI Coaching** → Have conversation with AI mentor
6. **Recommendations** → Receive personalized suggestions
7. **Profile** → View complete academic profile

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
vercel --prod
```

### Backend (Railway/Render)
```bash
cd server
npm start
```

### Database (Supabase)
- Deploy migrations
- Configure production settings
- Set up monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Supabase for backend services
- Radix UI for component library
- Framer Motion for animations
- OpenRouter for AI capabilities

---

**Built with ❤️ for students making important academic decisions**
