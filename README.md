# Zertainity.com - AI-Driven Educational Guidance Platform

**Tagline:** "Choose with Confidence — Your AI Mentor for Smarter Academic Choices"

## 🎯 Overview

Zertainity.com is a comprehensive AI-driven educational guidance platform that helps students make informed decisions about their academic future. The platform combines advanced AI technology with educational expertise to provide personalized guidance for stream selection and college matching.

## ✨ Features

### 1. Marks Input with OCR Support
- Upload marksheet images for automatic data extraction
- Manual entry option with subject selection
- Support for multiple education boards (CBSE, ICSE, State Board, etc.)

### 2. Dual Aptitude Assessment
- **Logical Reasoning Test:** 8 questions covering analytical thinking and problem-solving
- **Interest Profiling Test:** 8 questions about learning preferences and career interests
- Adaptive difficulty and real-time scoring

### 3. AI Career Coach
- Interactive conversational interface
- Emotional tone analysis and stress level detection
- Personalized guidance based on academic profile and interests

### 4. Personalized Recommendations
- **Stream Recommendations:** Science (PCM/PCB), Commerce, Arts
- **College Matching:** Top institutions based on academic profile
- Detailed reasoning and confidence scores for each recommendation

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript + TailwindCSS + Framer Motion
- **Backend:** Node.js (Express) + Supabase
- **Database:** PostgreSQL (via Supabase)
- **AI Integration:** OpenRouter/Groq API (configurable)
- **OCR:** Tesseract.js (for marksheet processing)
- **Authentication:** Google SSO (Supabase Auth)
- **Deployment:** Vercel (frontend + backend)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zertainity-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_AI_API_KEY=your_ai_api_key
   VITE_AI_API_URL=https://api.openrouter.ai/v1
   ```

4. **Database Setup**
   - Create a new Supabase project
   - Run the migration scripts in `supabase/migrations/`
   - Update the database schema for educational data

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # Shadcn/ui components
├── pages/              # Main application pages
│   ├── HomePage.tsx    # Landing page
│   ├── MarksInput.tsx  # Marks entry with OCR
│   ├── AptitudeTest.tsx # Dual aptitude tests
│   ├── AICoach.tsx     # AI conversation interface
│   └── Recommendations.tsx # Results and recommendations
├── services/           # API services
│   └── aiService.ts    # AI integration service
├── contexts/           # React contexts
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── lib/               # Utility functions
```

## 🧠 AI Integration

The platform uses AI services for:
- **Chat Responses:** Natural conversation with students
- **Recommendation Generation:** Personalized stream and college suggestions
- **Emotional Analysis:** Detecting stress levels and emotional tone
- **Profile Analysis:** Understanding student strengths and interests

### AI Service Configuration

The `aiService.ts` file handles all AI interactions. To integrate with different AI providers:

1. **OpenRouter:** Default configuration
2. **Groq:** Update API endpoints and authentication
3. **OpenAI Direct:** Modify the service implementation

## 🎨 Design System

- **Colors:** Blue and purple gradient theme
- **Typography:** Modern, readable fonts
- **Components:** Shadcn/ui component library
- **Animations:** Framer Motion for smooth transitions
- **Responsive:** Mobile-first design approach

## 📊 Database Schema

### Core Tables
- `students` - Student profiles and academic info
- `marks` - Subject-wise marks and percentages
- `aptitude_tests` - Individual test responses
- `aptitude_results` - Overall test scores
- `ai_conversations` - Chat history and analysis
- `streams` - Available academic streams
- `colleges` - College and course information
- `recommendations` - Generated recommendations

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Environment Variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_AI_API_KEY`
- `VITE_AI_API_URL`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

## 🔮 Future Enhancements

- [ ] Advanced OCR with multiple language support
- [ ] Integration with more AI providers
- [ ] Mobile app development
- [ ] Parent/teacher dashboard
- [ ] Advanced analytics and reporting
- [ ] Integration with school management systems

---

**Built with ❤️ for students making important academic decisions**