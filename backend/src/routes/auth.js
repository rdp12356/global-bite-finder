import express from 'express';
import { supabase } from '../services/supabase.js';

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

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { full_name, location_city, location_country } = req.body;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name,
        location_city,
        location_country,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to update profile' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get student profile
router.get('/student-profile', verifyToken, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('student_profiles')
      .select(`
        *,
        interest_areas(name, description),
        streams(name, description)
      `)
      .eq('user_id', req.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: 'Failed to fetch student profile' });
    }

    res.json(profile || null);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student profile' });
  }
});

// Create or update student profile
router.post('/student-profile', verifyToken, async (req, res) => {
  try {
    const {
      class_level,
      interest_area_id,
      preferred_stream_id,
      stress_level,
      confidence_level,
      learning_style,
      career_goals
    } = req.body;

    const { data, error } = await supabase
      .from('student_profiles')
      .upsert({
        user_id: req.user.id,
        class_level,
        interest_area_id,
        preferred_stream_id,
        stress_level,
        confidence_level,
        learning_style,
        career_goals,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to save student profile' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save student profile' });
  }
});

export default router;