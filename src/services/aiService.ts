// AI Service for Zertainity.com
// This service handles AI API calls for chat and recommendations

interface AIResponse {
  content: string;
  emotionalTone?: string;
  stressLevel?: number;
}

interface RecommendationRequest {
  studentProfile: {
    marks: Array<{
      subject: string;
      percentage: number;
    }>;
    aptitudeResults: {
      logicalScore: number;
      interestScore: number;
    };
    conversationInsights: {
      messageCount: number;
      averageResponseLength: number;
    };
  };
}

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    // In production, these would come from environment variables
    this.apiKey = process.env.VITE_AI_API_KEY || 'demo-key';
    this.baseUrl = process.env.VITE_AI_API_URL || 'https://api.openrouter.ai/v1';
  }

  // Generate AI chat response
  async generateChatResponse(userMessage: string, conversationHistory: string[]): Promise<AIResponse> {
    try {
      // For demo purposes, we'll use a mock response
      // In production, this would call the actual AI API
      return await this.mockChatResponse(userMessage, conversationHistory);
    } catch (error) {
      console.error('Error generating chat response:', error);
      return {
        content: "I apologize, but I'm having trouble processing your message right now. Could you please try again?",
        emotionalTone: "neutral",
        stressLevel: 0
      };
    }
  }

  // Generate recommendations
  async generateRecommendations(request: RecommendationRequest): Promise<{
    streams: any[];
    colleges: any[];
  }> {
    try {
      // For demo purposes, we'll use mock recommendations
      // In production, this would call the actual AI API
      return await this.mockRecommendations(request);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return { streams: [], colleges: [] };
    }
  }

  // Mock chat response for demo
  private async mockChatResponse(userMessage: string, conversationHistory: string[]): Promise<AIResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const responses = [
      "That's a great question! Your interest in problem-solving suggests you might excel in analytical fields.",
      "I can see you're thinking about your future seriously. What aspects of those careers appeal to you most?",
      "Your approach shows good critical thinking skills. How do you handle subjects that are more challenging for you?",
      "Understanding your learning style is crucial for academic success. That preference will help guide our recommendations.",
      "It's important to acknowledge how you handle stress. This self-awareness will help you succeed.",
      "Your motivation strategies show good self-management skills. How do you maintain this positive mindset?",
      "Confidence in your abilities is key. What helps you feel most confident academically?",
      "Those are interesting career interests! Let's explore how your academic strengths align with those goals."
    ];

    // Analyze emotional tone
    const emotionalTone = this.analyzeEmotionalTone(userMessage);
    const stressLevel = this.calculateStressLevel(userMessage);

    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      emotionalTone,
      stressLevel
    };
  }

  // Mock recommendations for demo
  private async mockRecommendations(request: RecommendationRequest): Promise<{
    streams: any[];
    colleges: any[];
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { marks, aptitudeResults } = request.studentProfile;
    
    // Generate stream recommendations based on profile
    const streams = [
      {
        id: "science-pcm",
        name: "Science (PCM)",
        description: "Physics, Chemistry, Mathematics - Perfect for engineering and technical careers",
        subjects: ["Physics", "Chemistry", "Mathematics", "English", "Computer Science"],
        careerPaths: ["Engineering", "Technology", "Research", "Data Science"],
        confidenceScore: this.calculateStreamConfidence(marks, "PCM"),
        reasoning: this.generateStreamReasoning(marks, aptitudeResults, "PCM"),
        difficultyLevel: 8
      },
      {
        id: "science-pcb",
        name: "Science (PCB)",
        description: "Physics, Chemistry, Biology - Ideal for medical and life sciences",
        subjects: ["Physics", "Chemistry", "Biology", "English", "Mathematics"],
        careerPaths: ["Medicine", "Biotechnology", "Pharmacy", "Research"],
        confidenceScore: this.calculateStreamConfidence(marks, "PCB"),
        reasoning: this.generateStreamReasoning(marks, aptitudeResults, "PCB"),
        difficultyLevel: 7
      },
      {
        id: "commerce",
        name: "Commerce",
        description: "Business studies, Economics, Accountancy - Great for business and finance careers",
        subjects: ["Business Studies", "Economics", "Accountancy", "English", "Mathematics"],
        careerPaths: ["Business", "Finance", "Economics", "Management"],
        confidenceScore: this.calculateStreamConfidence(marks, "Commerce"),
        reasoning: this.generateStreamReasoning(marks, aptitudeResults, "Commerce"),
        difficultyLevel: 6
      }
    ];

    // Generate college recommendations
    const colleges = [
      {
        id: "iit-delhi",
        name: "Indian Institute of Technology Delhi",
        location: "New Delhi, India",
        type: "Engineering",
        rating: 4.8,
        cutoffPercentage: 95,
        courses: ["Computer Science", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering"],
        website: "https://www.iitd.ac.in",
        establishedYear: 1961,
        reasoning: this.generateCollegeReasoning(marks, aptitudeResults, "IIT Delhi"),
        confidenceScore: this.calculateCollegeConfidence(marks, aptitudeResults, "IIT Delhi")
      },
      {
        id: "bits-pilani",
        name: "BITS Pilani",
        location: "Pilani, Rajasthan",
        type: "Engineering",
        rating: 4.6,
        cutoffPercentage: 90,
        courses: ["Computer Science", "Electronics", "Mechanical", "Chemical"],
        website: "https://www.bits-pilani.ac.in",
        establishedYear: 1964,
        reasoning: this.generateCollegeReasoning(marks, aptitudeResults, "BITS Pilani"),
        confidenceScore: this.calculateCollegeConfidence(marks, aptitudeResults, "BITS Pilani")
      }
    ];

    return { streams, colleges };
  }

  // Helper methods for analysis
  private analyzeEmotionalTone(text: string): string {
    const positiveWords = ["excited", "love", "enjoy", "confident", "motivated", "happy", "great", "amazing"];
    const negativeWords = ["stressed", "worried", "anxious", "difficult", "hard", "struggle", "confused", "overwhelmed"];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  }

  private calculateStressLevel(text: string): number {
    const stressWords = ["pressure", "stress", "anxiety", "worried", "nervous", "overwhelmed", "burnout"];
    const lowerText = text.toLowerCase();
    const stressCount = stressWords.filter(word => lowerText.includes(word)).length;
    return Math.min(10, stressCount * 2);
  }

  private calculateStreamConfidence(marks: any[], streamType: string): number {
    // Simple confidence calculation based on relevant subject scores
    const relevantSubjects = {
      "PCM": ["Mathematics", "Physics", "Chemistry"],
      "PCB": ["Biology", "Chemistry", "Physics"],
      "Commerce": ["Mathematics", "English"]
    };

    const subjects = relevantSubjects[streamType as keyof typeof relevantSubjects] || [];
    const relevantMarks = marks.filter(mark => subjects.includes(mark.subject));
    
    if (relevantMarks.length === 0) return 50;
    
    const averageScore = relevantMarks.reduce((sum, mark) => sum + mark.percentage, 0) / relevantMarks.length;
    return Math.min(95, Math.max(30, averageScore));
  }

  private calculateCollegeConfidence(marks: any[], aptitudeResults: any, collegeName: string): number {
    const averageMarks = marks.reduce((sum, mark) => sum + mark.percentage, 0) / marks.length;
    const averageAptitude = (aptitudeResults.logicalScore + aptitudeResults.interestScore) / 2;
    
    // Weighted calculation
    const confidence = (averageMarks * 0.6) + (averageAptitude * 0.4);
    return Math.min(95, Math.max(40, confidence));
  }

  private generateStreamReasoning(marks: any[], aptitudeResults: any, streamType: string): string {
    const topSubject = marks.reduce((prev, current) => 
      (prev.percentage > current.percentage) ? prev : current
    );
    
    return `Based on your strong performance in ${topSubject.subject} (${topSubject.percentage}%) and your ${streamType} aptitude, this stream aligns well with your academic strengths and interests.`;
  }

  private generateCollegeReasoning(marks: any[], aptitudeResults: any, collegeName: string): string {
    const averageMarks = marks.reduce((sum, mark) => sum + mark.percentage, 0) / marks.length;
    
    return `Your academic performance (${averageMarks.toFixed(1)}% average) and aptitude scores make you a competitive candidate for ${collegeName}. Your analytical thinking skills align well with their program requirements.`;
  }
}

export const aiService = new AIService();
export default aiService;