# Zertainity.com - AI Educational Guidance Platform

**Choose with Confidence — Your AI Mentor for Smarter Academic Choices**

Zertainity is a comprehensive AI-driven educational guidance platform that helps students make informed decisions about their academic future. By analyzing academic performance, conducting aptitude assessments, and providing personalized AI coaching, Zertainity guides students toward the right stream and college choices.

## 🎯 Features

### 1. Smart Marks Analysis
- **Manual Entry**: Students can enter marks directly across all subjects
- **OCR Integration**: Upload marksheet images for automatic mark extraction using Tesseract.js
- **Subject Management**: Support for languages, core subjects, and optional subjects
- **Performance Analytics**: Real-time percentage calculation and performance insights

### 2. Dual Aptitude Testing
- **Logical Reasoning Test**: 8 questions testing analytical thinking and problem-solving
- **Interest Profiling Test**: 8 questions exploring career interests and motivations
- **Adaptive Difficulty**: Questions adjust based on student responses
- **Real-time Scoring**: Immediate feedback and performance analysis

### 3. AI Career Coach
- **Natural Conversation**: AI-powered chat interface for personalized guidance
- **Emotional Analysis**: Detects student's emotional tone and stress levels
- **Contextual Responses**: AI generates responses based on academic profile and conversation history
- **Goal Exploration**: Helps students clarify their academic and career aspirations

### 4. Personalized Recommendations
- **Stream Recommendations**: AI suggests optimal Class 11 streams (Science, Commerce, Arts)
- **College Matching**: Personalized college and course recommendations
- **Suitability Scoring**: Confidence scores for each recommendation
- **Detailed Explanations**: "Why it fits you" explanations for each suggestion

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **shadcn/ui** component library
- **React Router** for navigation
- **React Hook Form** for form management

### Backend & Database
- **Supabase** (PostgreSQL) for database
- **Supabase Auth** for authentication
- **Google SSO** integration
- **Row Level Security** for data protection

### AI & Processing
- **Tesseract.js** for OCR functionality
- **OpenRouter/Groq** ready for AI integration
- **Custom AI services** for recommendation engine

### Development Tools
- **Vite** for build tooling
- **ESLint** for code linting
- **TypeScript** for type safety

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zertainity-educational-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration files in `/supabase/migrations/`
   - Enable Google OAuth in Supabase Auth settings

5. **Start development server**
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
├── pages/              # Main application pages
│   ├── Home.tsx        # Landing page
│   ├── Auth.tsx        # Authentication page
│   ├── MarksInput.tsx  # Marks entry and OCR
│   ├── AptitudeTest.tsx # Aptitude testing
│   ├── AICoach.tsx     # AI conversation
│   └── Recommendations.tsx # Results and recommendations
├── services/           # Business logic services
│   ├── marksService.ts
│   ├── aptitudeService.ts
│   ├── aiService.ts
│   └── recommendationService.ts
└── lib/                # Utility functions
```

## 🗄️ Database Schema

### Core Tables
- **students**: User profiles and academic information
- **subjects**: Available subjects and categories
- **student_marks**: Academic performance data
- **aptitude_tests**: Test definitions and metadata
- **aptitude_questions**: Test questions and answers
- **student_aptitude_results**: Test performance data
- **ai_conversations**: Chat history and emotional analysis
- **streams**: Available academic streams
- **colleges**: Institution information
- **courses**: Available courses and programs
- **student_recommendations**: Generated recommendations
- **interest_areas**: Career interest categories

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the migration files in order:
   - `20250118000000_create_educational_platform_schema.sql`
3. Enable Google OAuth in Authentication settings
4. Configure Row Level Security policies

### Google OAuth
1. Create a Google OAuth application
2. Add authorized redirect URIs
3. Configure in Supabase Auth settings

## 📱 Usage

### Student Journey
1. **Sign Up/Login**: Create account or sign in with Google
2. **Enter Marks**: Upload marksheet or enter marks manually
3. **Take Tests**: Complete logical reasoning and interest profiling tests
4. **AI Chat**: Have a conversation with the AI career coach
5. **Get Recommendations**: Receive personalized stream and college suggestions

### Admin Features
- View student progress and data
- Manage test questions and content
- Monitor system performance
- Update college and course information

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Tesseract.js](https://tesseract.projectnaptha.com/) for OCR functionality

## 📞 Support

For support, email support@zertainity.com or create an issue in the repository.

---

**Built with ❤️ for students making important academic decisions**