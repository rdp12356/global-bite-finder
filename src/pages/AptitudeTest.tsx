import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Clock, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer?: number;
  category: string;
  difficulty: number;
}

interface TestResult {
  testType: 'logical' | 'interest';
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  categoryScores: Record<string, number>;
}

const AptitudeTest = () => {
  const navigate = useNavigate();
  const [currentTest, setCurrentTest] = useState<'logical' | 'interest' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per test
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTestComplete, setIsTestComplete] = useState(false);

  // Sample questions for logical reasoning test
  const logicalQuestions: Question[] = [
    {
      id: 'l1',
      text: 'If all roses are flowers and some flowers are red, which of the following must be true?',
      options: ['All roses are red', 'Some roses are red', 'Some red things are roses', 'None of the above'],
      correctAnswer: 2,
      category: 'verbal',
      difficulty: 2
    },
    {
      id: 'l2',
      text: 'What comes next in the sequence: 2, 6, 12, 20, 30, ?',
      options: ['40', '42', '44', '48'],
      correctAnswer: 1,
      category: 'numerical',
      difficulty: 3
    },
    {
      id: 'l3',
      text: 'If A is taller than B, and B is taller than C, which statement is correct?',
      options: ['A is the tallest', 'C is the shortest', 'B is in the middle', 'All of the above'],
      correctAnswer: 3,
      category: 'logical',
      difficulty: 1
    },
    {
      id: 'l4',
      text: 'Complete the pattern: Circle, Square, Triangle, Circle, Square, ?',
      options: ['Triangle', 'Circle', 'Square', 'Pentagon'],
      correctAnswer: 0,
      category: 'spatial',
      difficulty: 2
    },
    {
      id: 'l5',
      text: 'If 3x + 7 = 22, what is the value of x?',
      options: ['3', '4', '5', '6'],
      correctAnswer: 2,
      category: 'numerical',
      difficulty: 2
    },
    {
      id: 'l6',
      text: 'Which word does not belong: Apple, Orange, Carrot, Banana',
      options: ['Apple', 'Orange', 'Carrot', 'Banana'],
      correctAnswer: 2,
      category: 'verbal',
      difficulty: 1
    },
    {
      id: 'l7',
      text: 'If you rearrange the letters "RAPID", you would get:',
      options: ['PARID', 'PRAID', 'PAIDR', 'None of the above'],
      correctAnswer: 1,
      category: 'verbal',
      difficulty: 2
    },
    {
      id: 'l8',
      text: 'What is 25% of 200?',
      options: ['40', '50', '60', '75'],
      correctAnswer: 1,
      category: 'numerical',
      difficulty: 1
    }
  ];

  // Sample questions for interest profiling test
  const interestQuestions: Question[] = [
    {
      id: 'i1',
      text: 'I enjoy solving complex problems and puzzles',
      options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
      category: 'analytical',
      difficulty: 1
    },
    {
      id: 'i2',
      text: 'I prefer working with numbers and data',
      options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
      category: 'quantitative',
      difficulty: 1
    },
    {
      id: 'i3',
      text: 'I like creating and designing things',
      options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
      category: 'creative',
      difficulty: 1
    },
    {
      id: 'i4',
      text: 'I enjoy helping and working with people',
      options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
      category: 'social',
      difficulty: 1
    },
    {
      id: 'i5',
      text: 'I am interested in understanding how things work',
      options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
      category: 'technical',
      difficulty: 1
    },
    {
      id: 'i6',
      text: 'I prefer working independently rather than in teams',
      options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
      category: 'independent',
      difficulty: 1
    },
    {
      id: 'i7',
      text: 'I enjoy reading and learning about new topics',
      options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
      category: 'academic',
      difficulty: 1
    },
    {
      id: 'i8',
      text: 'I like taking on leadership roles',
      options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'],
      category: 'leadership',
      difficulty: 1
    }
  ];

  const questions = currentTest === 'logical' ? logicalQuestions : interestQuestions;

  useEffect(() => {
    if (currentTest && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (currentTest && timeLeft === 0) {
      handleTestComplete();
    }
  }, [currentTest, timeLeft]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      setAnswers(prev => ({ ...prev, [currentQuestion]: selectedAnswer }));
      setSelectedAnswer(null);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleTestComplete();
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] ?? null);
    }
  };

  const calculateScore = (testType: 'logical' | 'interest') => {
    const testQuestions = testType === 'logical' ? logicalQuestions : interestQuestions;
    let correctAnswers = 0;
    const categoryScores: Record<string, number> = {};

    testQuestions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (testType === 'logical') {
        if (userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
        categoryScores[question.category] = (categoryScores[question.category] || 0) + 
          (userAnswer === question.correctAnswer ? 1 : 0);
      } else {
        // For interest test, score based on agreement level (0-4 scale)
        const score = userAnswer !== undefined ? userAnswer : 2; // Default to neutral
        categoryScores[question.category] = (categoryScores[question.category] || 0) + score;
      }
    });

    return {
      testType,
      score: testType === 'logical' ? correctAnswers : 
        Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / Object.keys(categoryScores).length,
      totalQuestions: testQuestions.length,
      correctAnswers,
      timeTaken: 300 - timeLeft,
      categoryScores
    };
  };

  const handleTestComplete = () => {
    const result = calculateScore(currentTest!);
    setTestResults(prev => [...prev, result]);
    
    if (currentTest === 'logical') {
      setCurrentTest('interest');
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setAnswers({});
      setTimeLeft(300);
    } else {
      setIsTestComplete(true);
    }
  };

  const startTest = (testType: 'logical' | 'interest') => {
    setCurrentTest(testType);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers({});
    setTimeLeft(300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isTestComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Aptitude Tests Complete!
            </h1>
            <p className="text-xl text-gray-600">
              Great job! Your results have been analyzed. Let's move to the AI coaching session.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {testResults.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {result.testType === 'logical' ? 'Logical Reasoning' : 'Interest Profiling'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Score:</span>
                      <Badge variant="secondary">
                        {result.testType === 'logical' 
                          ? `${result.correctAnswers}/${result.totalQuestions}`
                          : `${result.score.toFixed(1)}/4.0`
                        }
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Taken:</span>
                      <span>{formatTime(result.timeTaken)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/ai-coach")}
              className="flex items-center gap-2"
            >
              Continue to AI Coach
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Aptitude Assessment
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Take our comprehensive aptitude tests to discover your strengths and interests.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Each test takes 5 minutes</span>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('logical')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  Logical Reasoning Test
                </CardTitle>
                <CardDescription>
                  Test your analytical thinking, problem-solving, and reasoning abilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Verbal reasoning</li>
                  <li>• Numerical analysis</li>
                  <li>• Spatial awareness</li>
                  <li>• Pattern recognition</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('interest')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-purple-600" />
                  Interest Profiling Test
                </CardTitle>
                <CardDescription>
                  Discover your interests, preferences, and career inclinations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Career preferences</li>
                  <li>• Work style assessment</li>
                  <li>• Interest areas</li>
                  <li>• Personality traits</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={() => navigate("/marks")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marks Input
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {currentTest === 'logical' ? 'Logical Reasoning Test' : 'Interest Profiling Test'}
            </h1>
            <div className="flex items-center gap-2 text-lg font-semibold text-red-600">
              <Clock className="h-5 w-5" />
              {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <Progress 
              value={((currentQuestion + 1) / questions.length) * 100} 
              className="w-48"
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {questions[currentQuestion].text}
                </CardTitle>
                <CardDescription>
                  Category: {questions[currentQuestion].category} • 
                  Difficulty: {questions[currentQuestion].difficulty}/5
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedAnswer?.toString()}
                  onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                  className="space-y-4"
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="flex items-center gap-2"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Test' : 'Next Question'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AptitudeTest;
