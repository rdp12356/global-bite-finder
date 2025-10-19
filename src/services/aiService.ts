import axios from 'axios';

// AI Service for OpenRouter and Groq API integration
class AIService {
  private openRouterApiKey: string;
  private groqApiKey: string;
  private openRouterBaseUrl = 'https://openrouter.ai/api/v1';
  private groqBaseUrl = 'https://api.groq.com/openai/v1';

  constructor() {
    this.openRouterApiKey = import.meta.env.VITE_AI_API_KEY || '';
    this.groqApiKey = import.meta.env.VITE_GROQ_API_KEY || '';
  }

  // Generate personalized aptitude questions based on user profile
  async generatePersonalizedQuestions(userProfile: any, testType: 'logical' | 'interest'): Promise<any[]> {
    const prompt = `
    Generate 8 personalized ${testType} aptitude questions for a student with the following profile:
    - Academic Performance: ${userProfile.academicPerformance || 'Not specified'}
    - Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
    - Career Goals: ${userProfile.careerGoals || 'Not specified'}
    - Previous Answers: ${userProfile.previousAnswers || 'None'}

    For ${testType} questions:
    ${testType === 'logical' 
      ? 'Focus on analytical reasoning, problem-solving approaches, and logical thinking patterns that align with their academic strengths.'
      : 'Focus on personal preferences, motivations, work styles, and interests that would help determine suitable career paths.'
    }

    Return as JSON array with this structure:
    [
      {
        "id": "unique_id",
        "text": "Question text",
        "type": "${testType}",
        "options": {
          "A": "Option A",
          "B": "Option B", 
          "C": "Option C",
          "D": "Option D"
        },
        "difficulty": 1-5,
        "category": "category_name"
      }
    ]
    `;

    try {
      const response = await this.callOpenRouter(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating personalized questions:', error);
      return this.getFallbackQuestions(testType);
    }
  }

  // Generate career path guidance
  async generateCareerPath(profession: string, userProfile: any): Promise<any> {
    const prompt = `
    Generate detailed career path guidance for someone wanting to become a ${profession}.
    
    User Profile:
    - Academic Performance: ${userProfile.academicPerformance || 'Not specified'}
    - Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
    - Strengths: ${userProfile.strengths?.join(', ') || 'Not specified'}
    - Location Preference: ${userProfile.locationPreference || 'Not specified'}

    Provide comprehensive information including:
    1. Description of the profession
    2. Required subjects for Class 11-12
    3. Top colleges with cutoffs, fees, and ratings
    4. Step-by-step preparation roadmap
    5. Timeline for preparation
    6. Recommended resources
    7. Career progression and salary expectations
    8. Alternative career paths

    Return as JSON with this structure:
    {
      "profession": "${profession}",
      "description": "Detailed description",
      "subjects": ["Subject1", "Subject2", ...],
      "colleges": [
        {
          "name": "College Name",
          "location": "City, State",
          "cutoff": "Cutoff percentage/score",
          "fees": "Annual fees",
          "rating": 4.5,
          "website": "https://college.edu",
          "specialization": "Special focus areas"
        }
      ],
      "preparation": {
        "steps": ["Step 1", "Step 2", ...],
        "timeline": "X years",
        "resources": ["Resource 1", "Resource 2", ...],
        "entranceExams": ["Exam 1", "Exam 2", ...]
      },
      "careerProgression": {
        "entry": "Entry level position",
        "mid": "Mid level position", 
        "senior": "Senior level position",
        "salary": {
          "entry": "₹X - ₹Y/month",
          "mid": "₹X - ₹Y/month",
          "senior": "₹X - ₹Y/month"
        }
      },
      "alternatives": ["Alternative 1", "Alternative 2", ...]
    }
    `;

    try {
      const response = await this.callOpenRouter(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating career path:', error);
      return this.getFallbackCareerPath(profession);
    }
  }

  // AI Coach conversation
  async chatWithAICoach(message: string, conversationHistory: any[], userProfile: any): Promise<string> {
    const prompt = `
    You are an AI career coach helping a student make academic and career decisions. 
    
    Student Profile:
    - Academic Performance: ${userProfile.academicPerformance || 'Not specified'}
    - Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
    - Career Goals: ${userProfile.careerGoals || 'Not specified'}
    - Strengths: ${userProfile.strengths?.join(', ') || 'Not specified'}
    - Concerns: ${userProfile.concerns?.join(', ') || 'Not specified'}

    Conversation History:
    ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

    Current Message: ${message}

    Respond as a supportive, knowledgeable career coach. Be encouraging, ask follow-up questions, and provide practical advice. 
    Keep responses conversational and under 200 words. If this is the first message, introduce yourself and ask about their career aspirations.
    `;

    try {
      const response = await this.callOpenRouter(prompt);
      return response;
    } catch (error) {
      console.error('Error in AI coach chat:', error);
      return "I'm here to help you with your career guidance. Could you tell me more about your academic interests and career goals?";
    }
  }

  // Analyze emotional tone and stress levels
  async analyzeEmotionalTone(message: string): Promise<{tone: string, stressLevel: number, confidence: number}> {
    const prompt = `
    Analyze the emotional tone and stress level of this student's message: "${message}"
    
    Return as JSON:
    {
      "tone": "positive/neutral/negative/anxious/excited",
      "stressLevel": 1-10,
      "confidence": 1-10,
      "keywords": ["keyword1", "keyword2"],
      "suggestions": "Brief suggestion for support"
    }
    `;

    try {
      const response = await this.callOpenRouter(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error analyzing emotional tone:', error);
      return { tone: 'neutral', stressLevel: 5, confidence: 5 };
    }
  }

  // Generate personalized recommendations
  async generateRecommendations(userProfile: any, testResults: any[]): Promise<any> {
    const prompt = `
    Generate personalized academic and career recommendations based on this student's profile:
    
    Profile:
    - Academic Performance: ${userProfile.academicPerformance || 'Not specified'}
    - Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
    - Career Goals: ${userProfile.careerGoals || 'Not specified'}
    - Strengths: ${userProfile.strengths?.join(', ') || 'Not specified'}
    - Test Results: ${JSON.stringify(testResults)}

    Provide recommendations for:
    1. Class 11 Stream (Science/Commerce/Arts)
    2. Class 12 College choices
    3. Career paths to consider
    4. Areas for improvement
    5. Next steps

    Return as JSON:
    {
      "streamRecommendations": [
        {
          "stream": "Science",
          "confidence": 85,
          "reasoning": "Based on your strong performance in...",
          "subjects": ["Physics", "Chemistry", "Math"],
          "careerPaths": ["Engineering", "Medicine", "Research"]
        }
      ],
      "collegeRecommendations": [
        {
          "name": "College Name",
          "stream": "Science",
          "confidence": 90,
          "reasoning": "This college matches your profile because...",
          "cutoff": "95%+",
          "fees": "₹50,000/year"
        }
      ],
      "careerPaths": [
        {
          "profession": "Engineer",
          "confidence": 80,
          "reasoning": "Your analytical skills and interest in...",
          "preparation": "Focus on JEE preparation..."
        }
      ],
      "improvementAreas": ["Area 1", "Area 2"],
      "nextSteps": ["Step 1", "Step 2", "Step 3"]
    }
    `;

    try {
      const response = await this.callOpenRouter(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return this.getFallbackRecommendations();
    }
  }

  // Call OpenRouter API
  private async callOpenRouter(prompt: string): Promise<string> {
    if (!this.openRouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const response = await axios.post(
      `${this.openRouterBaseUrl}/chat/completions`,
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${this.openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Zertainity'
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  // Call Groq API (alternative)
  private async callGroq(prompt: string): Promise<string> {
    if (!this.groqApiKey) {
      throw new Error('Groq API key not configured');
    }

    const response = await axios.post(
      `${this.groqBaseUrl}/chat/completions`,
      {
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  // Fallback data when API calls fail
  private getFallbackQuestions(testType: string): any[] {
    return [
      {
        id: "1",
        text: testType === 'logical' 
          ? "How do you approach solving complex problems?"
          : "What type of work environment do you prefer?",
        type: testType,
        options: {
          A: "Break it down step by step",
          B: "Look for patterns first",
          C: "Try different approaches",
          D: "Ask for help"
        },
        difficulty: 2,
        category: "general"
      }
    ];
  }

  private getFallbackCareerPath(profession: string): any {
    return {
      profession,
      description: `A career in ${profession} offers various opportunities for growth and impact.`,
      subjects: ["Core subjects based on profession"],
      colleges: [
        {
          name: "Top University",
          location: "Major City",
          cutoff: "90%+",
          fees: "₹50,000/year",
          rating: 4.5,
          website: "https://university.edu"
        }
      ],
      preparation: {
        steps: ["Research the field", "Choose relevant subjects", "Prepare for entrance exams"],
        timeline: "2-3 years",
        resources: ["Official websites", "Preparation books", "Online courses"]
      },
      careerProgression: {
        entry: "Entry level position",
        mid: "Mid level position",
        senior: "Senior level position",
        salary: {
          entry: "₹30,000-50,000/month",
          mid: "₹50,000-1,00,000/month",
          senior: "₹1,00,000+/month"
        }
      }
    };
  }

  private getFallbackRecommendations(): any {
    return {
      streamRecommendations: [
        {
          stream: "Science",
          confidence: 75,
          reasoning: "Based on your academic performance and interests",
          subjects: ["Physics", "Chemistry", "Math"],
          careerPaths: ["Engineering", "Medicine", "Research"]
        }
      ],
      collegeRecommendations: [],
      careerPaths: [],
      improvementAreas: ["Continue building on your strengths"],
      nextSteps: ["Complete your assessments", "Research career options", "Plan your preparation"]
    };
  }
}

export default new AIService();