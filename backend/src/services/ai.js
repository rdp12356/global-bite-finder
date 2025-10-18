import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY,
  baseURL: process.env.OPENROUTER_API_URL || 'https://api.openai.com/v1'
});

export async function generateAIResponse(userMessage, context) {
  try {
    const { studentProfile, marks, aptitudeResults, conversationHistory } = context;
    
    // Build context for the AI
    let systemPrompt = `You are Zertainity, an AI career coach and educational guidance counselor. You help students make informed decisions about their academic and career paths.

Your role:
- Be supportive, encouraging, and understanding
- Ask thoughtful questions to understand the student's interests and goals
- Provide personalized advice based on their academic profile
- Help them discover their strengths and potential career paths
- Be conversational and friendly, not clinical or robotic

Student's Profile:
${studentProfile ? `
- Class Level: ${studentProfile.class_level || 'Not specified'}
- Learning Style: ${studentProfile.learning_style || 'Not specified'}
- Career Goals: ${studentProfile.career_goals || 'Not specified'}
- Interest Area: ${studentProfile.interest_areas?.name || 'Not specified'}
` : 'No profile information available'}

Academic Performance:
${marks && marks.length > 0 ? marks.map(mark => 
  `- ${mark.subjects?.name}: ${mark.marks_obtained}/${mark.total_marks} (${mark.percentage}%)`
).join('\n') : 'No marks data available'}

Aptitude Test Results:
${aptitudeResults && aptitudeResults.length > 0 ? aptitudeResults.map(result => 
  `- ${result.aptitude_tests?.name}: ${result.percentage}%`
).join('\n') : 'No aptitude test results available'}

Previous conversation:
${conversationHistory ? conversationHistory.map(msg => 
  `${msg.type}: ${msg.content}`
).join('\n') : 'This is the start of our conversation'}

Respond naturally to the student's message. Keep your response conversational, helpful, and encouraging. If this seems like the end of our conversation, provide a brief summary of what we've discussed and suggest next steps.`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI response generation error:', error);
    
    // Fallback responses based on context
    const fallbackResponses = [
      "That's really interesting! I can see you're thinking deeply about your future. Can you tell me more about what motivates you in your studies?",
      "I appreciate you sharing that with me. Your perspective is valuable in helping me understand your goals better. What subjects do you find most engaging?",
      "Thank you for being so open with me. It's clear you're taking your academic journey seriously. What kind of work environment do you think you'd thrive in?",
      "That's a great insight! I can see you're reflecting thoughtfully on your interests. How do you prefer to learn new things?",
      "I understand what you're saying. Your honesty helps me provide better guidance. What career field appeals to you most right now?"
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}

export function analyzeEmotionalTone(message) {
  const positiveWords = ['love', 'enjoy', 'excited', 'confident', 'happy', 'great', 'amazing', 'wonderful', 'fantastic', 'excellent', 'brilliant', 'perfect', 'awesome', 'incredible'];
  const negativeWords = ['hate', 'difficult', 'stressed', 'worried', 'anxious', 'confused', 'frustrated', 'hard', 'terrible', 'awful', 'horrible', 'disappointed', 'sad', 'angry', 'upset'];
  const neutralWords = ['okay', 'fine', 'average', 'normal', 'regular', 'standard', 'decent', 'acceptable', 'alright', 'so-so'];
  
  const lowerMessage = message.toLowerCase();
  
  const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;
  const neutralCount = neutralWords.filter(word => lowerMessage.includes(word)).length;
  
  // Also check for emotional indicators
  const excitementIndicators = ['!', 'excited', 'can\'t wait', 'looking forward'];
  const concernIndicators = ['?', 'worried', 'concerned', 'not sure', 'confused'];
  
  const hasExcitement = excitementIndicators.some(indicator => lowerMessage.includes(indicator));
  const hasConcern = concernIndicators.some(indicator => lowerMessage.includes(indicator));
  
  if (positiveCount > negativeCount && positiveCount > neutralCount) return 'positive';
  if (negativeCount > positiveCount && negativeCount > neutralCount) return 'negative';
  if (hasExcitement) return 'excited';
  if (hasConcern) return 'concerned';
  return 'neutral';
}

export async function generateRecommendations(userProfile) {
  try {
    const { studentProfile, marks, aptitudeResults, chatSession, userId } = userProfile;
    
    // This is a simplified recommendation engine
    // In production, you'd want more sophisticated AI-based recommendations
    
    const recommendations = [];
    
    // Analyze academic performance
    const strongSubjects = marks?.filter(mark => mark.percentage >= 80) || [];
    const weakSubjects = marks?.filter(mark => mark.percentage < 60) || [];
    
    // Analyze aptitude results
    const logicalReasoning = aptitudeResults?.find(r => r.aptitude_tests?.test_type === 'logical_reasoning');
    const interestProfiling = aptitudeResults?.find(r => r.aptitude_tests?.test_type === 'interest_profiling');
    
    // Generate stream recommendations based on performance
    if (strongSubjects.some(s => s.subjects?.name === 'Mathematics') && 
        strongSubjects.some(s => s.subjects?.name === 'Physics')) {
      recommendations.push({
        type: 'stream',
        itemId: 'science-pcm', // This would be the actual stream ID
        confidence: 0.9,
        reasoning: 'Your strong performance in Mathematics and Physics, combined with your analytical thinking skills, makes Science (PCM) an excellent choice for you.'
      });
    }
    
    if (strongSubjects.some(s => s.subjects?.name === 'Computer Science') || 
        (logicalReasoning && logicalReasoning.percentage >= 80)) {
      recommendations.push({
        type: 'stream',
        itemId: 'computer-science',
        confidence: 0.85,
        reasoning: 'Your aptitude for logical reasoning and interest in technology makes Computer Science a great fit for your profile.'
      });
    }
    
    // Generate college recommendations based on performance and preferences
    const overallPercentage = marks?.length > 0 ? 
      marks.reduce((sum, mark) => sum + mark.percentage, 0) / marks.length : 0;
    
    if (overallPercentage >= 90) {
      recommendations.push({
        type: 'college',
        itemId: 'iit-delhi', // This would be the actual college ID
        confidence: 0.95,
        reasoning: 'Your excellent academic performance makes you a strong candidate for top-tier institutions like IIT Delhi.'
      });
    }
    
    if (overallPercentage >= 80) {
      recommendations.push({
        type: 'college',
        itemId: 'delhi-university',
        confidence: 0.85,
        reasoning: 'Your good academic performance qualifies you for excellent universities like Delhi University.'
      });
    }
    
    return recommendations;
  } catch (error) {
    console.error('Recommendation generation error:', error);
    return [];
  }
}