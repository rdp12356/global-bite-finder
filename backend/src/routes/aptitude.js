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

// Get available aptitude tests
router.get('/tests', async (req, res) => {
  try {
    const { test_type } = req.query;
    
    let query = supabase
      .from('aptitude_tests')
      .select('*')
      .order('created_at');

    if (test_type) {
      query = query.eq('test_type', test_type);
    }

    const { data: tests, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch tests' });
    }

    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tests' });
  }
});

// Get specific test
router.get('/tests/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: test, error } = await supabase
      .from('aptitude_tests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Test not found' });
    }

    res.json(test);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch test' });
  }
});

// Submit test results
router.post('/submit', verifyToken, async (req, res) => {
  try {
    const { test_id, answers } = req.body;
    
    if (!test_id || !answers) {
      return res.status(400).json({ error: 'Test ID and answers are required' });
    }

    // Get test details
    const { data: test, error: testError } = await supabase
      .from('aptitude_tests')
      .select('questions, test_type')
      .eq('id', test_id)
      .single();

    if (testError) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Calculate score
    let score = 0;
    const questions = test.questions;
    
    if (test.test_type === 'logical_reasoning') {
      // For logical reasoning, check against correct answers
      for (const question of questions) {
        const userAnswer = answers[question.id];
        if (userAnswer === question.correct_answer) {
          score++;
        }
      }
    } else {
      // For interest profiling, count answered questions
      score = Object.keys(answers).length;
    }

    const maxScore = questions.length;

    // Save results
    const { data: result, error: saveError } = await supabase
      .from('aptitude_results')
      .insert({
        user_id: req.user.id,
        test_id,
        answers,
        score,
        max_score: maxScore
      })
      .select()
      .single();

    if (saveError) {
      return res.status(400).json({ error: 'Failed to save test results' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit test results' });
  }
});

// Get user's test results
router.get('/results', verifyToken, async (req, res) => {
  try {
    const { test_type } = req.query;
    
    let query = supabase
      .from('aptitude_results')
      .select(`
        *,
        aptitude_tests(name, test_type, description)
      `)
      .eq('user_id', req.user.id)
      .order('completed_at', { ascending: false });

    if (test_type) {
      query = query.eq('aptitude_tests.test_type', test_type);
    }

    const { data: results, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch results' });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Get specific test result
router.get('/results/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: result, error } = await supabase
      .from('aptitude_results')
      .select(`
        *,
        aptitude_tests(name, test_type, description, questions)
      `)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch result' });
  }
});

// Get user's overall aptitude profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const { data: results, error } = await supabase
      .from('aptitude_results')
      .select(`
        *,
        aptitude_tests(name, test_type)
      `)
      .eq('user_id', req.user.id)
      .order('completed_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch aptitude profile' });
    }

    // Calculate overall statistics
    const logicalReasoning = results.find(r => r.aptitude_tests.test_type === 'logical_reasoning');
    const interestProfiling = results.find(r => r.aptitude_tests.test_type === 'interest_profiling');

    const profile = {
      logicalReasoning: logicalReasoning ? {
        score: logicalReasoning.score,
        maxScore: logicalReasoning.max_score,
        percentage: logicalReasoning.percentage,
        completedAt: logicalReasoning.completed_at
      } : null,
      interestProfiling: interestProfiling ? {
        score: interestProfiling.score,
        maxScore: interestProfiling.max_score,
        percentage: interestProfiling.percentage,
        completedAt: interestProfiling.completed_at
      } : null,
      overallScore: results.length > 0 ? 
        Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) : 0,
      testsCompleted: results.length
    };

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch aptitude profile' });
  }
});

export default router;