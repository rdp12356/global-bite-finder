import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  options: string[];
  type: 'logical' | 'analytical' | 'interest' | 'motivation';
  correctAnswer?: number;
}

const AptitudeTest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentTest, setCurrentTest] = useState<'logical' | 'interest' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes per test
  const [isTestComplete, setIsTestComplete] = useState(false);

  const logicalQuestions: Question[] = [
    {
      id: "l1",
      text: "If all roses are flowers and some flowers are red, which of the following must be true?",
      options: [
        "All roses are red",
        "Some roses are red", 
        "Some red things are roses",
        "None of the above"
      ],
      type: 'logical',
      correctAnswer: 2
    },
    {
      id: "l2", 
      text: "Complete the sequence: 2, 6, 12, 20, 30, ?",
      options: ["40", "42", "44", "48"],
      type: 'logical',
      correctAnswer: 1
    },
    {
      id: "l3",
      text: "If A is taller than B, and B is taller than C, which statement is definitely true?",
      options: [
        "A is the tallest",
        "C is the shortest",
        "A is taller than C",
        "All of the above"
      ],
      type: 'logical',
      correctAnswer: 3
    },
    {
      id: "l4",
      text: "A clock shows 3:15. What is the angle between the hour and minute hands?",
      options: ["0°", "7.5°", "15°", "30°"],
      type: 'logical',
      correctAnswer: 1
    },
    {
      id: "l5",
      text: "If 5 machines can produce 5 widgets in 5 minutes, how many machines are needed to produce 100 widgets in 100 minutes?",
      options: ["5", "10", "20", "100"],
      type: 'logical',
      correctAnswer: 0
    },
    {
      id: "l6",
      text: "What comes next in the pattern: O, T, T, F, F, S, S, ?",
      options: ["E", "N", "T", "H"],
      type: 'logical',
      correctAnswer: 0
    },
    {
      id: "l7",
      text: "If a train travels 60 km/h for 2 hours, then 80 km/h for 1 hour, what is its average speed?",
      options: ["65 km/h", "70 km/h", "66.67 km/h", "75 km/h"],
      type: 'logical',
      correctAnswer: 2
    },
    {
      id: "l8",
      text: "In a group of 30 people, 18 like coffee and 12 like tea. If 8 like both, how many like neither?",
      options: ["2", "4", "6", "8"],
      type: 'logical',
      correctAnswer: 3
    }
  ];

  const interestQuestions: Question[] = [
    {
      id: "i1",
      text: "Which activity would you most enjoy?",
      options: [
        "Solving complex mathematical problems",
        "Conducting scientific experiments",
        "Writing creative stories or articles",
        "Managing a team project"
      ],
      type: 'interest'
    },
    {
      id: "i2",
      text: "What type of work environment appeals to you most?",
      options: [
        "A quiet laboratory or research facility",
        "A dynamic office with team collaboration",
        "An outdoor or field work environment",
        "A creative studio or workshop"
      ],
      type: 'interest'
    },
    {
      id: "i3",
      text: "Which subject would you choose for independent study?",
      options: [
        "Advanced Mathematics or Statistics",
        "Biology or Environmental Science",
        "Literature or Philosophy",
        "Economics or Business Studies"
      ],
      type: 'interest'
    },
    {
      id: "i4",
      text: "What motivates you most in your studies?",
      options: [
        "Understanding how things work",
        "Helping others and making a difference",
        "Expressing creativity and ideas",
        "Achieving recognition and success"
      ],
      type: 'interest'
    },
    {
      id: "i5",
      text: "Which career path interests you most?",
      options: [
        "Engineering or Technology",
        "Medicine or Healthcare",
        "Arts or Media",
        "Business or Finance"
      ],
      type: 'interest'
    },
    {
      id: "i6",
      text: "How do you prefer to learn new concepts?",
      options: [
        "Through hands-on experimentation",
        "By reading and analyzing information",
        "Through discussion and debate",
        "By teaching others"
      ],
      type: 'interest'
    },
    {
      id: "i7",
      text: "What type of problem-solving do you enjoy?",
      options: [
        "Technical or mechanical problems",
        "Human or social problems",
        "Creative or artistic challenges",
        "Strategic or planning problems"
      ],
      type: 'interest'
    },
    {
      id: "i8",
      text: "Which extracurricular activity would you choose?",
      options: [
        "Science club or robotics",
        "Debate team or student government",
        "Art club or music",
        "Sports or fitness"
      ],
      type: 'interest'
    }
  ];

  const currentQuestions = currentTest === 'logical' ? logicalQuestions : interestQuestions;
  const totalQuestions = currentQuestions.length;

  useEffect(() => {
    if (currentTest && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, currentTest]);

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Test completed
      setIsTestComplete(true);
      toast({
        title: "Test Completed!",
        description: `You've finished the ${currentTest} aptitude test.`,
      });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const startTest = (testType: 'logical' | 'interest') => {
    setCurrentTest(testType);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(600);
    setIsTestComplete(false);
  };

  const handleTestComplete = () => {
    if (currentTest === 'logical') {
      setCurrentTest('interest');
      setCurrentQuestion(0);
      setAnswers({});
      setTimeLeft(600);
      setIsTestComplete(false);
    } else {
      // Both tests completed
      navigate("/chat");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = currentTest ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;

  if (!currentTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Aptitude Assessment
            </h1>
            <p className="text-xl text-gray-600">
              Take our comprehensive tests to discover your strengths and interests
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Logical & Analytical Reasoning</CardTitle>
                </div>
                <CardDescription>
                  Test your problem-solving abilities, pattern recognition, and logical thinking skills.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>• 8 carefully crafted questions</li>
                  <li>• 10 minutes time limit</li>
                  <li>• Covers mathematical reasoning, patterns, and logic</li>
                  <li>• No negative marking</li>
                </ul>
                <Button 
                  onClick={() => startTest('logical')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Start Logical Reasoning Test
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Interest & Motivation Profiling</CardTitle>
                </div>
                <CardDescription>
                  Discover your interests, work preferences, and what motivates you in your academic journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>• 8 personality-based questions</li>
                  <li>• 10 minutes time limit</li>
                  <li>• Explores your interests and career preferences</li>
                  <li>• Helps identify your ideal academic path</li>
                </ul>
                <Button 
                  onClick={() => startTest('interest')}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Start Interest Profiling Test
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => navigate("/marks")}
              className="px-8"
            >
              Back to Marks Input
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isTestComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {currentTest === 'logical' ? 'Logical Reasoning Test' : 'Interest Profiling Test'} Complete!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {currentTest === 'logical' 
                ? "Great job! Now let's discover your interests and motivations."
                : "Excellent! You've completed both aptitude tests. Let's move to the AI chat session."
              }
            </p>
            <div className="space-y-4">
              <Button
                onClick={handleTestComplete}
                className="px-8 py-3 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {currentTest === 'logical' ? 'Start Interest Profiling Test' : 'Continue to AI Chat'}
              </Button>
              <div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentTest(null)}
                  className="px-6"
                >
                  Back to Test Selection
                </Button>
              </div>
            </div>
          </motion.div>
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
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentTest === 'logical' ? 'Logical Reasoning Test' : 'Interest Profiling Test'}
              </h1>
              <p className="text-gray-600">
                Question {currentQuestion + 1} of {totalQuestions}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">
                {currentQuestions[currentQuestion].text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQuestions[currentQuestion].id]?.toString()}
                onValueChange={(value) => handleAnswerSelect(currentQuestions[currentQuestion].id, parseInt(value))}
                className="space-y-4"
              >
                {currentQuestions[currentQuestion].options.map((option, index) => (
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

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="px-6"
            >
              Previous
            </Button>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentTest(null)}
                className="px-6"
              >
                Exit Test
              </Button>
              <Button
                onClick={handleNextQuestion}
                disabled={answers[currentQuestions[currentQuestion].id] === undefined}
                className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {currentQuestion === totalQuestions - 1 ? 'Finish Test' : 'Next Question'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AptitudeTest;
