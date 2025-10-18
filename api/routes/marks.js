const express = require('express');
const router = express.Router();

// Placeholder marks routes
router.post('/', (req, res) => {
  res.json({ message: 'Save marks endpoint - to be implemented' });
});

router.get('/:userId', (req, res) => {
  res.json({ message: 'Get user marks endpoint - to be implemented' });
});

router.post('/ocr', (req, res) => {
  res.json({ message: 'OCR processing endpoint - to be implemented' });
});

module.exports = router;