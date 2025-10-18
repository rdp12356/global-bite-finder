# Zertainity API

This directory contains the backend API implementation for the Zertainity platform.

## Structure

```
api/
├── routes/
│   ├── auth.js          # Authentication endpoints
│   ├── marks.js         # Marks management
│   ├── aptitude.js      # Aptitude test handling
│   ├── ai.js           # AI coach and recommendations
│   └── recommendations.js # Recommendation engine
├── services/
│   ├── supabase.js     # Supabase client
│   ├── ai.js          # AI service integration
│   └── ocr.js         # OCR processing
├── middleware/
│   ├── auth.js        # Authentication middleware
│   └── validation.js  # Request validation
└── index.js           # Main server file
```

## Environment Variables

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
AI_API_KEY=your_ai_api_key
AI_API_URL=https://openrouter.ai/api/v1
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install express cors helmet morgan dotenv
   ```

2. Set up environment variables

3. Start the server:
   ```bash
   node api/index.js
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Marks
- `POST /api/marks` - Save student marks
- `GET /api/marks/:userId` - Get user marks
- `POST /api/marks/ocr` - Process marksheet image

### Aptitude Tests
- `GET /api/aptitude/questions` - Get aptitude questions
- `POST /api/aptitude/submit` - Submit test results
- `GET /api/aptitude/results/:userId` - Get user results

### AI Coach
- `POST /api/ai/chat` - Send message to AI coach
- `GET /api/ai/conversation/:sessionId` - Get conversation history

### Recommendations
- `POST /api/recommendations/generate` - Generate recommendations
- `GET /api/recommendations/:userId` - Get user recommendations