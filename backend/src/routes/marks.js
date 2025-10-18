import express from 'express';
import { supabase } from '../services/supabase.js';
import { processMarksheetImage } from '../services/ocr.js';

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

// Get user's marks
router.get('/', verifyToken, async (req, res) => {
  try {
    const { exam_type } = req.query;
    
    let query = supabase
      .from('student_marks')
      .select(`
        *,
        subjects(name, category, description)
      `)
      .eq('user_id', req.user.id);

    if (exam_type) {
      query = query.eq('exam_type', exam_type);
    }

    const { data: marks, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch marks' });
    }

    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch marks' });
  }
});

// Save marks
router.post('/', verifyToken, async (req, res) => {
  try {
    const { marks } = req.body;
    
    if (!Array.isArray(marks) || marks.length === 0) {
      return res.status(400).json({ error: 'Marks array is required' });
    }

    // Validate marks data
    for (const mark of marks) {
      if (!mark.subject_id || !mark.marks_obtained || !mark.total_marks) {
        return res.status(400).json({ error: 'Invalid marks data' });
      }
    }

    // Delete existing marks for this exam type
    const examType = marks[0].exam_type || 'Class 10';
    await supabase
      .from('student_marks')
      .delete()
      .eq('user_id', req.user.id)
      .eq('exam_type', examType);

    // Insert new marks
    const marksWithUserId = marks.map(mark => ({
      ...mark,
      user_id: req.user.id
    }));

    const { data, error } = await supabase
      .from('student_marks')
      .insert(marksWithUserId)
      .select(`
        *,
        subjects(name, category, description)
      `);

    if (error) {
      return res.status(400).json({ error: 'Failed to save marks' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save marks' });
  }
});

// Process marksheet image with OCR
router.post('/upload', verifyToken, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Process the image with OCR
    const extractedMarks = await processMarksheetImage(req.file.buffer);
    
    res.json({
      success: true,
      marks: extractedMarks,
      message: 'Marksheet processed successfully'
    });
  } catch (error) {
    console.error('OCR processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process marksheet',
      message: 'Please try uploading a clearer image or enter marks manually'
    });
  }
});

// Get available subjects
router.get('/subjects', async (req, res) => {
  try {
    const { category } = req.query;
    
    let query = supabase
      .from('subjects')
      .select('*')
      .order('name');

    if (category) {
      query = query.eq('category', category);
    }

    const { data: subjects, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch subjects' });
    }

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Calculate overall performance
router.get('/performance', verifyToken, async (req, res) => {
  try {
    const { exam_type } = req.query;
    
    let query = supabase
      .from('student_marks')
      .select('marks_obtained, total_marks')
      .eq('user_id', req.user.id);

    if (exam_type) {
      query = query.eq('exam_type', exam_type);
    }

    const { data: marks, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch performance data' });
    }

    if (marks.length === 0) {
      return res.json({
        totalMarks: 0,
        totalPossibleMarks: 0,
        percentage: 0,
        subjectCount: 0
      });
    }

    const totalMarks = marks.reduce((sum, mark) => sum + mark.marks_obtained, 0);
    const totalPossibleMarks = marks.reduce((sum, mark) => sum + mark.total_marks, 0);
    const percentage = totalPossibleMarks > 0 ? Math.round((totalMarks / totalPossibleMarks) * 100 * 100) / 100 : 0;

    res.json({
      totalMarks,
      totalPossibleMarks,
      percentage,
      subjectCount: marks.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate performance' });
  }
});

export default router;