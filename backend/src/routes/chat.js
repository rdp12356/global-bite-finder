import express from 'express';
import { supabase } from '../services/supabase.js';
import { generateAIResponse, analyzeEmotionalTone } from '../services/ai.js';

const router = express.Router();

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token verification failed' });
  }
};

// Create new chat session
router.post('/sessions', verifyToken, async (req, res) => {
  try {
    const { initialMessage } = req.body;

    const { data: session, error } = await supabase
      .from('ai_chat_sessions')
      .insert({
        user_id: req.user.id,
        session_data: {
          messages: initialMessage ? [{
            type: 'user',
            content: initialMessage,
            timestamp: new Date().toISOString()
          }] : []
        }
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to create chat session' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// Get chat sessions
router.get('/sessions', verifyToken, async (req, res) => {
  try {
    const { data: sessions, error } = await supabase
      .from('ai_chat_sessions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch chat sessions' });
    }

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat sessions' });
  }
});

// Get specific chat session
router.get('/sessions/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: session, error } = await supabase
      .from('ai_chat_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat session' });
  }
});

// Send message to AI
router.post('/sessions/:id/messages', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get current session
    const { data: session, error: sessionError } = await supabase
      .from('ai_chat_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (sessionError) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Get user's academic profile for context
    const { data: studentProfile } = await supabase
      .from('student_profiles')
      .select(`
        *,
        interest_areas(name, description),
        streams(name, description)
      `)
      .eq('user_id', req.user.id)
      .single();

    const { data: marks } = await supabase
      .from('student_marks')
      .select(`
        *,
        subjects(name, category)
      `)
      .eq('user_id', req.user.id);

    const { data: aptitudeResults } = await supabase
      .from('aptitude_results')
      .select(`
        *,
        aptitude_tests(name, test_type)
      `)
      .eq('user_id', req.user.id);

    // Add user message to session
    const currentMessages = session.session_data.messages || [];
    const updatedMessages = [
      ...currentMessages,
      {
        type: 'user',
        content: message,
        timestamp: new Date().toISOString()
      }
    ];

    // Generate AI response
    const aiResponse = await generateAIResponse(message, {
      studentProfile,
      marks,
      aptitudeResults,
      conversationHistory: currentMessages
    });

    // Analyze emotional tone
    const emotionalTone = analyzeEmotionalTone(message);

    // Add AI response to session
    const finalMessages = [
      ...updatedMessages,
      {
        type: 'ai',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        emotionalTone
      }
    ];

    // Update session with new messages
    const { data: updatedSession, error: updateError } = await supabase
      .from('ai_chat_sessions')
      .update({
        session_data: {
          ...session.session_data,
          messages: finalMessages
        },
        emotional_analysis: {
          ...session.emotional_analysis,
          [new Date().toISOString()]: emotionalTone
        }
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({ error: 'Failed to update chat session' });
    }

    res.json({
      message: aiResponse,
      emotionalTone,
      session: updatedSession
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Complete chat session and generate analysis
router.post('/sessions/:id/complete', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from('ai_chat_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (sessionError) {
      return res.status(404).json({ error: 'Chat session not found' });
    }

    // Analyze entire conversation
    const messages = session.session_data.messages || [];
    const userMessages = messages.filter(m => m.type === 'user');
    
    // Calculate overall emotional analysis
    const emotionalAnalysis = {
      overallTone: 'positive', // This would be calculated from all messages
      stressLevel: 3, // This would be calculated from conversation
      confidenceLevel: 4, // This would be calculated from conversation
      learningStyle: 'visual', // This would be inferred from responses
      interests: ['technology', 'problem-solving'], // This would be extracted
      careerGoals: 'To make a positive impact through technology' // This would be extracted
    };

    // Update session with completion
    const { data: updatedSession, error: updateError } = await supabase
      .from('ai_chat_sessions')
      .update({
        completed_at: new Date().toISOString(),
        emotional_analysis: emotionalAnalysis
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({ error: 'Failed to complete chat session' });
    }

    res.json({
      session: updatedSession,
      emotionalAnalysis
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete chat session' });
  }
});

export default router;