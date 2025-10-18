import Tesseract from 'tesseract.js';

export async function processMarksheetImage(imageBuffer) {
  try {
    // Use Tesseract.js to extract text from the image
    const { data: { text } } = await Tesseract.recognize(
      imageBuffer,
      'eng',
      {
        logger: m => console.log(m) // Optional: log progress
      }
    );

    // Parse the extracted text to find marks
    // This is a simplified parser - in production, you'd want more sophisticated parsing
    const marks = parseMarksFromText(text);
    
    return marks;
  } catch (error) {
    console.error('OCR processing error:', error);
    throw new Error('Failed to process marksheet image');
  }
}

function parseMarksFromText(text) {
  // This is a simplified parser - in production, you'd want more sophisticated parsing
  // based on common marksheet formats
  
  const lines = text.split('\n');
  const marks = [];
  
  // Common subject patterns
  const subjectPatterns = [
    /(?:english|eng)/i,
    /(?:mathematics|maths?|math)/i,
    /(?:physics|phy)/i,
    /(?:chemistry|chem)/i,
    /(?:biology|bio)/i,
    /(?:history|hist)/i,
    /(?:geography|geo)/i,
    /(?:economics|econ)/i,
    /(?:computer science|cs|computer)/i,
    /(?:political science|pol sci)/i,
    /(?:business studies|business)/i,
    /(?:accountancy|accounts)/i
  ];
  
  // Number patterns for marks
  const markPatterns = [
    /(\d+)\s*\/\s*(\d+)/g, // 85/100 format
    /(\d+)\s*out\s*of\s*(\d+)/gi, // 85 out of 100 format
    /(\d+)\s*marks?/gi, // 85 marks format
    /(\d+)\s*\/\s*(\d+)\s*marks?/gi // 85/100 marks format
  ];
  
  for (const line of lines) {
    // Check if line contains a subject
    let subjectName = null;
    for (const pattern of subjectPatterns) {
      const match = line.match(pattern);
      if (match) {
        subjectName = normalizeSubjectName(match[0]);
        break;
      }
    }
    
    if (subjectName) {
      // Look for marks in the same line or nearby lines
      for (const pattern of markPatterns) {
        const matches = [...line.matchAll(pattern)];
        for (const match of matches) {
          const obtained = parseInt(match[1]);
          const total = parseInt(match[2]) || 100; // Default to 100 if total not found
          
          if (obtained >= 0 && obtained <= total && total > 0) {
            marks.push({
              subject: subjectName,
              marksObtained: obtained,
              totalMarks: total,
              percentage: Math.round((obtained / total) * 100 * 100) / 100
            });
            break; // Found marks for this subject, move to next
          }
        }
      }
    }
  }
  
  return marks;
}

function normalizeSubjectName(subject) {
  const subjectMap = {
    'english': 'English',
    'eng': 'English',
    'mathematics': 'Mathematics',
    'maths': 'Mathematics',
    'math': 'Mathematics',
    'physics': 'Physics',
    'phy': 'Physics',
    'chemistry': 'Chemistry',
    'chem': 'Chemistry',
    'biology': 'Biology',
    'bio': 'Biology',
    'history': 'History',
    'hist': 'History',
    'geography': 'Geography',
    'geo': 'Geography',
    'economics': 'Economics',
    'econ': 'Economics',
    'computer science': 'Computer Science',
    'cs': 'Computer Science',
    'computer': 'Computer Science',
    'political science': 'Political Science',
    'pol sci': 'Political Science',
    'business studies': 'Business Studies',
    'business': 'Business Studies',
    'accountancy': 'Accountancy',
    'accounts': 'Accountancy'
  };
  
  return subjectMap[subject.toLowerCase()] || subject;
}