import { generateRecommendations as generateAIRecommendations } from './ai.js';

export async function generateRecommendations(userProfile) {
  try {
    // Use the AI service to generate recommendations
    const recommendations = await generateAIRecommendations(userProfile);
    
    // You could add additional business logic here
    // such as filtering based on user preferences, location, etc.
    
    return recommendations;
  } catch (error) {
    console.error('Recommendation service error:', error);
    throw error;
  }
}