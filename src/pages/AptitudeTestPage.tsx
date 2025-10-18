import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Brain,
  Target,
  Timer
} from 'lucide-react'

interface Question {
  id: number
  question: string
  options: string[]
  correct_answer?: number
  categories?: string[]
  difficulty: string
}

interface TestResult {
  testType: string
  score: number
  maxScore: number
  percentage: number
  answers: { [key: number]: number }
}

const logicalReasoningQuestions: Question[] = [
  {
    id: 1,
    question: "If all roses are flowers and some flowers are red, which of the following must be true?",
    options: [
      "All roses are red",
      "Some roses are red", 
      "Some red things are roses",
      "None of the above"
    ],
    correct_answer: 2,
    difficulty: "medium"
  },
  {
    id: 2,
    question: "Complete the sequence: 2, 6, 12, 20, ?",
    options: ["28", "30", "32", "36"],
    correct_answer: 1,
    difficulty: "easy"
  },
  {
    id: 3,
    question: "If A is taller than B, and B is taller than C, which statement is definitely true?",
    options: [
      "A is the tallest",
      "C is the shortest",
      "A is taller than C",
      "All of the above"
    ],
    correct_answer: 3,
    difficulty: "easy"
  },
  {
    id: 4,
    question: "A clock shows 3:15. What is the angle between the hour and minute hands?",
    options: ["0°", "7.5°", "15°", "30°"],
    correct_answer: 1,
    difficulty: "hard"
  },
  {
    id: 5,
    question: "If 5 machines can produce 5 widgets in 5 minutes, how many machines are needed to produce 100 widgets in 100 minutes?",
    options: ["5", "10", "20", "100"],
    correct_answer: 0,
    difficulty: "medium"
  },
  {
    id: 6,
    question: "What comes next in the pattern: O, T, T, F, F, S, S, ?",
    options: ["E", "N", "T", "H"],
    correct_answer: 0,
    difficulty: "hard"
  },
  {
    id: 7,
    question: "If a square has a diagonal of 10 units, what is its area?",
    options: ["50", "100", "25√2", "50√2"],
    correct_answer: 0,
    difficulty: "medium"
  },
  {
    id: 8,
    question: "In a group of 30 people, 18 like coffee and 12 like tea. If 8 like both, how many like neither?",
    options: ["4", "6", "8", "10"],
    correct_answer: 2,
    difficulty: "medium"
  }
]

const interestProfilingQuestions: Question[] = [
  {
    id: 1,
    question: "What type of activities do you enjoy most?",
    options: [
      "Solving puzzles and problems",
      "Creating art or music",
      "Helping others",
      "Working with technology"
    ],
    categories: ["analytical", "creative", "social", "technical"],
    difficulty: "easy"
  },
  {
    id: 2,
    question: "In your free time, you would prefer to:",
    options: [
      "Read books or articles",
      "Play sports or exercise",
      "Socialize with friends",
      "Work on personal projects"
    ],
    categories: ["intellectual", "physical", "social", "independent"],
    difficulty: "easy"
  },
  {
    id: 3,
    question: "What motivates you most in your studies?",
    options: [
      "Understanding how things work",
      "Expressing your creativity",
      "Making a difference in society",
      "Building something useful"
    ],
    categories: ["analytical", "creative", "social", "practical"],
    difficulty: "easy"
  },
  {
    id: 4,
    question: "Your ideal work environment would be:",
    options: [
      "A quiet library or lab",
      "A dynamic, creative space",
      "A place where you help people",
      "A modern office with latest technology"
    ],
    categories: ["quiet", "creative", "helping", "tech"],
    difficulty: "easy"
  },
  {
    id: 5,
    question: "What type of problems do you find most interesting?",
    options: [
      "Mathematical or scientific problems",
      "Design or aesthetic challenges",
      "Social or human problems",
      "Technical or engineering problems"
    ],
    categories: ["scientific", "design", "social", "technical"],
    difficulty: "medium"
  },
  {
    id: 6,
    question: "How do you prefer to learn new things?",
    options: [
      "Through reading and research",
      "Through hands-on practice",
      "Through discussion with others",
      "Through online tutorials and videos"
    ],
    categories: ["reading", "practical", "collaborative", "digital"],
    difficulty: "medium"
  },
  {
    id: 7,
    question: "What career field appeals to you most?",
    options: [
      "Research and academia",
      "Arts and entertainment",
      "Healthcare or social work",
      "Technology and innovation"
    ],
    categories: ["research", "arts", "helping", "tech"],
    difficulty: "medium"
  },
  {
    id: 8,
    question: "What would you like to be known for?",
    options: [
      "Your intelligence and knowledge",
      "Your creativity and originality",
      "Your compassion and helpfulness",
      "Your innovation and problem-solving"
    ],
    categories: ["intellectual", "creative", "compassionate", "innovative"],
    difficulty: "medium"
  }
]

export default function AptitudeTestPage() {
  const navigate = useNavigate()
  const [currentTest, setCurrentTest] = useState<'logical' | 'interest' | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes per test
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isTestComplete, setIsTestComplete] = useState(false)

  const questions = currentTest === 'logical' ? logicalReasoningQuestions : interestProfilingQuestions

  useEffect(() => {
    if (currentTest && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      handleTestComplete()
    }
  }, [currentTest, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      handleTestComplete()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleTestComplete = () => {
    const score = questions.reduce((acc, question) => {
      const userAnswer = answers[question.id]
      if (currentTest === 'logical' && userAnswer === question.correct_answer) {
        return acc + 1
      }
      return acc
    }, 0)

    const result: TestResult = {
      testType: currentTest!,
      score: currentTest === 'logical' ? score : Object.keys(answers).length,
      maxScore: questions.length,
      percentage: Math.round(((currentTest === 'logical' ? score : Object.keys(answers).length) / questions.length) * 100),
      answers: { ...answers }
    }

    setTestResults(prev => [...prev, result])
    
    if (currentTest === 'logical') {
      setCurrentTest('interest')
      setCurrentQuestion(0)
      setAnswers({})
      setTimeLeft(600)
    } else {
      setIsTestComplete(true)
    }
  }

  const handleStartTest = (testType: 'logical' | 'interest') => {
    setCurrentTest(testType)
    setCurrentQuestion(0)
    setAnswers({})
    setTimeLeft(600)
  }

  const handleContinueToChat = () => {
    // Save test results to database
    console.log('Saving test results:', testResults)
    navigate('/ai-chat')
  }

  if (isTestComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Test Complete!</h1>
                  <p className="text-muted-foreground">Step 2 of 4 - Aptitude Tests Results</p>
                </div>
              </div>
              <Badge variant="outline">Step 2 of 4</Badge>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
              <p className="text-xl text-muted-foreground">
                You've completed both aptitude tests. Here are your results:
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {testResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        {result.testType === 'logical' ? (
                          <Brain className="h-5 w-5 mr-2 text-blue-600" />
                        ) : (
                          <Target className="h-5 w-5 mr-2 text-purple-600" />
                        )}
                        {result.testType === 'logical' ? 'Logical Reasoning' : 'Interest Profiling'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-blue-600">{result.percentage}%</p>
                          <p className="text-sm text-muted-foreground">Score</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Correct Answers</span>
                            <span>{result.score}/{result.maxScore}</span>
                          </div>
                          <Progress value={result.percentage} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <Button size="lg" onClick={handleContinueToChat}>
                Continue to AI Chat Coach
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentTest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/marks')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Marks
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Aptitude Tests</h1>
                  <p className="text-muted-foreground">Step 2 of 4 - Discover your strengths</p>
                </div>
              </div>
              <Badge variant="outline">Step 2 of 4</Badge>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4">Take Your Aptitude Tests</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Complete two tests to help us understand your logical reasoning abilities and interests
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="h-6 w-6 mr-2 text-blue-600" />
                      Logical Reasoning Test
                    </CardTitle>
                    <CardDescription>
                      Test your analytical and logical thinking skills with 8 challenging questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        10 minutes
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Target className="h-4 w-4 mr-2" />
                        8 questions
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleStartTest('logical')}
                    >
                      Start Logical Reasoning Test
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-6 w-6 mr-2 text-purple-600" />
                      Interest Profiling Test
                    </CardTitle>
                    <CardDescription>
                      Discover your interests and career inclinations with personalized questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        10 minutes
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Target className="h-4 w-4 mr-2" />
                        8 questions
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => handleStartTest('interest')}
                    >
                      Start Interest Profiling Test
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setCurrentTest(null)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tests
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {currentTest === 'logical' ? 'Logical Reasoning Test' : 'Interest Profiling Test'}
                </h1>
                <p className="text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Timer className="h-4 w-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <Badge variant="outline">Step 2 of 4</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} of {questions.length} questions
              </span>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {questions[currentQuestion].question}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {questions[currentQuestion].difficulty}
                    </Badge>
                    {questions[currentQuestion].categories && (
                      <Badge variant="outline">
                        Interest Profiling
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={answers[questions[currentQuestion].id]?.toString()}
                    onValueChange={(value) => 
                      handleAnswerSelect(questions[currentQuestion].id, parseInt(value))
                    }
                    className="space-y-4"
                  >
                    {questions[currentQuestion].options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button 
              onClick={handleNext}
              disabled={answers[questions[currentQuestion].id] === undefined}
            >
              {currentQuestion === questions.length - 1 ? 'Finish Test' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}