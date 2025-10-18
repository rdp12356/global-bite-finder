const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Zertainity API is running' });
});

// AI Recommendation endpoint (mock)
app.post('/api/recommendations', (req, res) => {
  const { academicData, aptitudeResults, conversationInsights } = req.body;
  
  // Mock AI processing
  setTimeout(() => {
    const recommendations = {
      streams: [
        {
          id: '1',
          name: 'Science (PCM)',
          type: 'science',
          confidence: 92,
          reasoning: 'Your strong performance in Mathematics and Science subjects, combined with high logical reasoning scores, makes you an excellent fit for Science stream.',
          subjects: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Computer Science'],
          careerPaths: ['Engineering', 'Data Science', 'Research', 'Architecture', 'Medicine'],
          matchScore: 92
        }
      ],
      colleges: [
        {
          id: '1',
          name: 'Indian Institute of Technology Delhi',
          type: 'Institute',
          location: 'New Delhi, Delhi',
          rating: 4.8,
          website: 'https://www.iitd.ac.in',
          description: 'Premier engineering institute with world-class facilities and faculty.',
          courses: ['Computer Science Engineering', 'Mechanical Engineering', 'Electrical Engineering'],
          cutoff: 98.5,
          fees: 250000,
          matchScore: 95,
          reasoning: 'Your exceptional academic performance and strong logical reasoning make you a competitive candidate for IIT Delhi.'
        }
      ]
    };
    
    res.json(recommendations);
  }, 2000);
});

// OCR endpoint (mock)
app.post('/api/ocr', (req, res) => {
  // Mock OCR processing
  setTimeout(() => {
    const extractedData = {
      subjects: [
        { name: 'English', marksObtained: 85, totalMarks: 100, percentage: 85 },
        { name: 'Mathematics', marksObtained: 92, totalMarks: 100, percentage: 92 },
        { name: 'Science', marksObtained: 88, totalMarks: 100, percentage: 88 },
        { name: 'Social Studies', marksObtained: 90, totalMarks: 100, percentage: 90 }
      ],
      board: 'CBSE',
      examYear: 2024
    };
    
    res.json(extractedData);
  }, 1500);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Zertainity API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
