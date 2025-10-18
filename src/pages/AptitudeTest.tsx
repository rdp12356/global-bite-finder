import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Target,
  Lightbulb,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Question {
  id: string;
  text: string;
  type: 'logical' | 'interest';
  options: Record<string, string>;
  correctAnswer?: string;
  difficulty: number;
  category: string;
}

interface TestResult {
  questionId: string;
  selectedAnswer: string;
  timeTaken: number;
  isCorrect?: boolean;
}

const AptitudeTest = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentTest, setCurrentTest] = useState<'logical' | 'interest' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes per question
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isTestComplete, setIsTestComplete] = useState(false);

  // Mock questions - in real app, these would come from API
  const logicalQuestions: Question[] = [
    {
      id: "1",
      text: "If all roses are flowers and some flowers are red, which statement is definitely true?",
      type: "logical",
      options: {
        A: "All roses are red",
        B: "Some roses are red", 
        C: "Some red things are roses",
        D: "No roses are red"
      },
      correctAnswer: "C",
      difficulty: 2,
      category: "logical_reasoning"
    },
    {
      id: "2", 
      text: "Complete the sequence: 2, 6, 12, 20, ?",
      type: "logical",
      options: {
        A: "28",
        B: "30",
        C: "32", 
        D: "36"
      },
      correctAnswer: "B",
      difficulty: 3,
      category: "number_sequence"
    },
    {
      id: "3",
      text: "If A is taller than B, and B is taller than C, which statement is true?",
      type: "logical", 
      options: {
        A: "A is the tallest",
        B: "C is the shortest",
        C: "A is taller than C",
        D: "All of the above"
      },
      correctAnswer: "D",
      difficulty: 2,
      category: "logical_reasoning"
    }
  ];

  const interestQuestions: Question[] = [
    {
      id: "4",
      text: "I enjoy solving complex problems and puzzles",
      type: "interest",
      options: {
        A: "Strongly Agree",
        B: "Agree", 
        C: "Neutral",
        D: "Disagree",
        E: "Strongly Disagree"
      },
      difficulty: 1,
      category: "problem_solving"
    },
    {
      id: "5",
      text: "I prefer working in a team rather than alone",
      type: "interest",
      options: {
        A: "Strongly Agree",
        B: "Agree",
        C: "Neutral", 
        D: "Disagree",
        E: "Strongly Disagree"
      },
      difficulty: 1,
      category: "teamwork"
    },
    {
      id: "6",
      text: "I am interested in understanding how things work",
      type: "interest",
      options: {
        A: "Strongly Agree",
        B: "Agree",
        C: "Neutral",
        D: "Disagree", 
        E: "Strongly Disagree"
      },
      difficulty: 1,
      category: "curiosity"
    }
  ];

  const currentQuestions = currentTest === 'logical' ? logicalQuestions : interestQuestions;
  const currentQ = currentQuestions[currentQuestion];

  useEffect(() => {
    if (currentTest && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, currentTest]);

  const startTest = (testType: 'logical' | 'interest') => {
    setCurrentTest(testType);
    setCurrentQuestion(0);
    setTimeLeft(300);
    setSelectedAnswer("");
    setTestResults([]);
    setQuestionStartTime(Date.now());
    setIsTestComplete(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
      const result: TestResult = {
        questionId: currentQ.id,
        selectedAnswer,
        timeTaken,
        isCorrect: currentQ.correctAnswer ? selectedAnswer === currentQ.correctAnswer : undefined
      };
      
      setTestResults([...testResults, result]);
    }

    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setTimeLeft(300);
      setQuestionStartTime(Date.now());
    } else {
      // Test completed
      setIsTestComplete(true);
      toast({
        title: "Test completed!",
        description: `You've finished the ${currentTest} aptitude test.`,
      });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer("");
      setTimeLeft(300);
      setQuestionStartTime(Date.now());
    }
  };

  const submitTest = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save your test results.",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, you would save to Supabase here
      toast({
        title: "Test results saved!",
        description: "Your aptitude test results have been recorded.",
      });
    } catch (error) {
      toast({
        title: "Error saving results",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isTestComplete) {
    const correctAnswers = testResults.filter(r => r.isCorrect).length;
    const totalQuestions = testResults.length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Test Completed!
            </h1>
            <p className="text-xl text-gray-600">
              Great job completing the {currentTest} aptitude test.
            </p>
          </motion.div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{totalQuestions}</p>
                  <p className="text-sm text-gray-500">Questions Answered</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">{correctAnswers}</p>
                  <p className="text-sm text-gray-500">Correct Answers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">{accuracy.toFixed(1)}%</p>
                  <p className="text-sm text-gray-500">Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={submitTest} className="flex-1">
              Save Results & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setCurrentTest(null);
                setIsTestComplete(false);
                setTestResults([]);
              }}
              className="flex-1"
            >
              Take Another Test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentTest) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Aptitude Assessment
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Take our dual aptitude tests to discover your strengths and interests. 
              This will help us provide better recommendations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => startTest('logical')}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Logical Reasoning</CardTitle>
                    <Badge variant="secondary">8 Questions</Badge>
                  </div>
                </div>
                <CardDescription>
                  Test your analytical thinking, problem-solving abilities, and logical reasoning skills.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>5 minutes per question</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>Adaptive difficulty</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => startTest('interest')}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Interest Profiling</CardTitle>
                    <Badge variant="secondary">8 Questions</Badge>
                  </div>
                </div>
                <CardDescription>
                  Discover your interests, motivations, and preferences to find the right career path.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>No time limit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    <span>Personalized insights</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {currentTest === 'logical' ? 'Logical Reasoning' : 'Interest Profiling'} Test
            </h1>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {currentQuestion + 1} of {currentQuestions.length}
            </Badge>
          </div>
          <Progress 
            value={((currentQuestion + 1) / currentQuestions.length) * 100} 
            className="h-2 mb-4"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1}</span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </span>
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
                <CardTitle className="text-xl">{currentQ.text}</CardTitle>
                <CardDescription>
                  {currentTest === 'logical' 
                    ? 'Select the best answer based on logical reasoning'
                    : 'Choose the option that best describes you'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedAnswer}
                  onValueChange={handleAnswerSelect}
                  className="space-y-4"
                >
                  {Object.entries(currentQ.options).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <RadioGroupItem value={key} id={key} />
                      <Label htmlFor={key} className="text-base cursor-pointer">
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
          >
            {currentQuestion === currentQuestions.length - 1 ? 'Finish Test' : 'Next Question'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AptitudeTest;