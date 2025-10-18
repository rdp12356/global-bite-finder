import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  emotionalTone?: 'positive' | 'neutral' | 'concerned' | 'excited';
}

export interface ConversationData {
  messages: Message[];
  emotionalProfile: {
    confidence: number;
    stressLevel: number;
    motivation: number;
    clarity: number;
  };
  completedAt: Date;
}

export class AIService {
  // Save conversation to database
  static async saveConversation(studentId: string, conversationData: ConversationData) {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const conversationToInsert: TablesInsert<'ai_conversations'> = {
        student_id: studentId,
        session_id: sessionId,
        messages: conversationData.messages as any, // JSONB field
        emotional_analysis: conversationData.emotionalProfile as any, // JSONB field
        conversation_summary: this.generateConversationSummary(conversationData.messages),
        started_at: new Date().toISOString(),
        completed_at: conversationData.completedAt.toISOString()
      };

      const { error } = await supabase
        .from('ai_conversations')
        .insert(conversationToInsert);

      if (error) throw error;

      return { success: true, sessionId };
    } catch (error) {
      console.error('Error saving conversation:', error);
      return { success: false, error };
    }
  }

  // Get student's conversations
  static async getStudentConversations(studentId: string) {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('student_id', studentId)
        .order('started_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return { success: false, error };
    }
  }

  // Generate AI response (simulated - in production would call OpenRouter/Groq)
  static async generateAIResponse(
    userMessage: string, 
    conversationHistory: Message[], 
    studentProfile: any
  ): Promise<string> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const messageCount = conversationHistory.length;
    const emotionalTone = this.analyzeEmotionalTone(userMessage);
    
    // Generate contextual responses based on conversation flow and student profile
    if (messageCount <= 2) {
      return `That's really insightful! I can sense ${emotionalTone === 'excited' ? 'your enthusiasm' : emotionalTone === 'concerned' ? 'some concerns' : 'thoughtfulness'} in your response.

Tell me more about what drives you academically. What subjects do you find most engaging, and why?`;
    } else if (messageCount <= 4) {
      return `I appreciate you sharing that with me. It's clear you've put thought into your academic journey.

Now, I'm curious about your future aspirations. When you think about your ideal career or field of study, what comes to mind? What kind of work environment do you see yourself thriving in?`;
    } else if (messageCount <= 6) {
      return `That's a wonderful perspective! Your self-awareness really shines through.

One more thing I'd like to understand - how do you typically handle challenges or setbacks in your studies? This helps me understand your resilience and learning style.`;
    } else {
      return `Thank you for this wonderful conversation! I feel like I have a much better understanding of who you are and what you're looking for.

Based on everything you've shared, along with your academic performance and aptitude results, I'm ready to provide you with personalized recommendations that should align perfectly with your goals and aspirations.

Are you ready to see what I've prepared for you?`;
    }
  }

  // Analyze emotional tone of text
  static analyzeEmotionalTone(text: string): 'positive' | 'neutral' | 'concerned' | 'excited' {
    const positiveWords = ['excited', 'love', 'enjoy', 'confident', 'happy', 'great', 'amazing', 'wonderful'];
    const concernedWords = ['worried', 'stressed', 'anxious', 'confused', 'difficult', 'hard', 'struggle', 'problem'];
    const excitedWords = ['excited', 'thrilled', 'passionate', 'enthusiastic', 'amazing', 'incredible', 'fantastic'];
    
    const lowerText = text.toLowerCase();
    
    if (excitedWords.some(word => lowerText.includes(word))) return 'excited';
    if (concernedWords.some(word => lowerText.includes(word))) return 'concerned';
    if (positiveWords.some(word => lowerText.includes(word))) return 'positive';
    return 'neutral';
  }

  // Generate conversation summary
  static generateConversationSummary(messages: Message[]): string {
    const userMessages = messages.filter(m => m.type === 'user');
    const keyTopics = this.extractKeyTopics(userMessages);
    
    return `Student discussed: ${keyTopics.join(', ')}. ${userMessages.length} messages exchanged.`;
  }

  // Extract key topics from user messages
  private static extractKeyTopics(userMessages: Message[]): string[] {
    const topics: string[] = [];
    const text = userMessages.map(m => m.content).join(' ').toLowerCase();
    
    if (text.includes('math') || text.includes('mathematics')) topics.push('mathematics');
    if (text.includes('science') || text.includes('physics') || text.includes('chemistry')) topics.push('science');
    if (text.includes('art') || text.includes('creative') || text.includes('design')) topics.push('arts');
    if (text.includes('business') || text.includes('commerce') || text.includes('economics')) topics.push('business');
    if (text.includes('medicine') || text.includes('doctor') || text.includes('healthcare')) topics.push('medicine');
    if (text.includes('engineering') || text.includes('technology') || text.includes('computer')) topics.push('technology');
    if (text.includes('law') || text.includes('legal') || text.includes('justice')) topics.push('law');
    if (text.includes('teaching') || text.includes('education') || text.includes('teacher')) topics.push('education');
    
    return topics.length > 0 ? topics : ['general academic interests'];
  }

  // Analyze emotional profile from conversation
  static analyzeEmotionalProfile(messages: Message[]): {
    confidence: number;
    stressLevel: number;
    motivation: number;
    clarity: number;
  } {
    const userMessages = messages.filter(m => m.type === 'user');
    const text = userMessages.map(m => m.content).join(' ').toLowerCase();
    
    // Simple keyword-based analysis (in production, would use more sophisticated NLP)
    let confidence = 0.5;
    let stressLevel = 0.5;
    let motivation = 0.5;
    let clarity = 0.5;
    
    // Confidence indicators
    if (text.includes('confident') || text.includes('sure') || text.includes('know')) confidence += 0.2;
    if (text.includes('unsure') || text.includes('confused') || text.includes('doubt')) confidence -= 0.2;
    
    // Stress indicators
    if (text.includes('stressed') || text.includes('worried') || text.includes('anxious')) stressLevel += 0.3;
    if (text.includes('calm') || text.includes('relaxed') || text.includes('peaceful')) stressLevel -= 0.2;
    
    // Motivation indicators
    if (text.includes('excited') || text.includes('passionate') || text.includes('motivated')) motivation += 0.3;
    if (text.includes('bored') || text.includes('uninterested') || text.includes('tired')) motivation -= 0.2;
    
    // Clarity indicators
    if (text.includes('clear') || text.includes('understand') || text.includes('focused')) clarity += 0.2;
    if (text.includes('confused') || text.includes('unclear') || text.includes('lost')) clarity -= 0.2;
    
    return {
      confidence: Math.max(0, Math.min(1, confidence)),
      stressLevel: Math.max(0, Math.min(1, stressLevel)),
      motivation: Math.max(0, Math.min(1, motivation)),
      clarity: Math.max(0, Math.min(1, clarity))
    };
  }
}