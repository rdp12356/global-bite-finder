import express from 'express';
import { supabase } from '../services/supabase.js';
import { generateRecommendations } from '../services/recommendations.js';

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

// Get user's recommendations
router.get('/', verifyToken, async (req, res) => {
  try {
    const { data: recommendations, error } = await supabase
      .from('recommendations')
      .select(`
        *,
        ai_chat_sessions(emotional_analysis)
      `)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch recommendations' });
    }

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Generate new recommendations
router.post('/generate', verifyToken, async (req, res) => {
  try {
    const { chat_session_id } = req.body;

    // Get user's complete profile
    const [studentProfile, marks, aptitudeResults, chatSession] = await Promise.all([
      supabase
        .from('student_profiles')
        .select(`
          *,
          interest_areas(name, description),
          streams(name, description)
        `)
        .eq('user_id', req.user.id)
        .single(),
      
      supabase
        .from('student_marks')
        .select(`
          *,
          subjects(name, category)
        `)
        .eq('user_id', req.user.id),
      
      supabase
        .from('aptitude_results')
        .select(`
          *,
          aptitude_tests(name, test_type)
        `)
        .eq('user_id', req.user.id),
      
      chat_session_id ? 
        supabase
          .from('ai_chat_sessions')
          .select('*')
          .eq('id', chat_session_id)
          .eq('user_id', req.user.id)
          .single() :
        Promise.resolve({ data: null })
    ]);

    // Generate recommendations using AI
    const recommendations = await generateRecommendations({
      studentProfile: studentProfile.data,
      marks: marks.data,
      aptitudeResults: aptitudeResults.data,
      chatSession: chatSession.data,
      userId: req.user.id
    });

    // Save recommendations to database
    const { data: savedRecommendations, error: saveError } = await supabase
      .from('recommendations')
      .insert(recommendations.map(rec => ({
        user_id: req.user.id,
        chat_session_id,
        recommendation_type: rec.type,
        recommended_item_id: rec.itemId,
        confidence_score: rec.confidence,
        reasoning: rec.reasoning
      })))
      .select();

    if (saveError) {
      return res.status(400).json({ error: 'Failed to save recommendations' });
    }

    res.json(savedRecommendations);
  } catch (error) {
    console.error('Recommendation generation error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Get stream recommendations
router.get('/streams', verifyToken, async (req, res) => {
  try {
    const { data: recommendations, error } = await supabase
      .from('recommendations')
      .select(`
        *,
        streams(name, description, subjects)
      `)
      .eq('user_id', req.user.id)
      .eq('recommendation_type', 'stream')
      .order('confidence_score', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch stream recommendations' });
    }

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stream recommendations' });
  }
});

// Get college recommendations
router.get('/colleges', verifyToken, async (req, res) => {
  try {
    const { data: recommendations, error } = await supabase
      .from('recommendations')
      .select(`
        *,
        colleges(name, location, type, rating, website, cutoff_marks)
      `)
      .eq('user_id', req.user.id)
      .eq('recommendation_type', 'college')
      .order('confidence_score', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch college recommendations' });
    }

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch college recommendations' });
  }
});

// Get course recommendations
router.get('/courses', verifyToken, async (req, res) => {
  try {
    const { data: recommendations, error } = await supabase
      .from('recommendations')
      .select(`
        *,
        courses(name, description, duration_years, cutoff_marks, fees_range),
        colleges(name, location, type, rating)
      `)
      .eq('user_id', req.user.id)
      .eq('recommendation_type', 'course')
      .order('confidence_score', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch course recommendations' });
    }

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course recommendations' });
  }
});

// Get all available streams
router.get('/available/streams', async (req, res) => {
  try {
    const { data: streams, error } = await supabase
      .from('streams')
      .select('*')
      .order('name');

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch streams' });
    }

    res.json(streams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch streams' });
  }
});

// Get all available colleges
router.get('/available/colleges', async (req, res) => {
  try {
    const { state, type, min_rating } = req.query;
    
    let query = supabase
      .from('colleges')
      .select('*')
      .order('rating', { ascending: false });

    if (state) {
      query = query.eq('state', state);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (min_rating) {
      query = query.gte('rating', parseFloat(min_rating));
    }

    const { data: colleges, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch colleges' });
    }

    res.json(colleges);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch colleges' });
  }
});

// Get all available courses
router.get('/available/courses', async (req, res) => {
  try {
    const { college_id, stream_id } = req.query;
    
    let query = supabase
      .from('courses')
      .select(`
        *,
        colleges(name, location, type, rating),
        streams(name, description)
      `)
      .order('name');

    if (college_id) {
      query = query.eq('college_id', college_id);
    }
    if (stream_id) {
      query = query.eq('stream_id', stream_id);
    }

    const { data: courses, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch courses' });
    }

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

export default router;