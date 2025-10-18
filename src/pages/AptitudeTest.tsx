import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, Target, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

interface TestResult {
  testType: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
}

const AptitudeTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTest, setCurrentTest] = useState<"logical" | "interest" | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Logical Reasoning Questions
  const logicalQuestions: Question[] = [
    {
      id: "l1",
      text: "If all roses are flowers and some flowers are red, which statement is definitely true?",
      options: [
        "All roses are red",
        "Some roses are red",
        "Some red things are roses",
        "No roses are red"
      ],
      correctAnswer: 2,
      category: "logical"
    },
    {
      id: "l2",
      text: "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
      options: ["40", "42", "44", "48"],
      correctAnswer: 1,
      category: "logical"
    },
    {
      id: "l3",
      text: "If A is taller than B, and B is taller than C, which statement is true?",
      options: [
        "A is the tallest",
        "C is the shortest",
        "B is in the middle",
        "All of the above"
      ],
      correctAnswer: 3,
      category: "logical"
    },
    {
      id: "l4",
      text: "A clock shows 3:15. What is the angle between the hour and minute hands?",
      options: ["0°", "7.5°", "15°", "30°"],
      correctAnswer: 1,
      category: "logical"
    },
    {
      id: "l5",
      text: "If 5 machines can produce 5 widgets in 5 minutes, how many machines are needed to produce 100 widgets in 100 minutes?",
      options: ["5", "10", "20", "100"],
      correctAnswer: 0,
      category: "logical"
    },
    {
      id: "l6",
      text: "What is the next number in the series: 1, 4, 9, 16, 25, ?",
      options: ["30", "36", "49", "64"],
      correctAnswer: 1,
      category: "logical"
    },
    {
      id: "l7",
      text: "If RED = 18, BLUE = 21, what does GREEN equal?",
      options: ["22", "24", "26", "28"],
      correctAnswer: 2,
      category: "logical"
    },
    {
      id: "l8",
      text: "A cube is painted on all sides and cut into 27 smaller cubes. How many small cubes have exactly 2 painted faces?",
      options: ["6", "8", "12", "18"],
      correctAnswer: 2,
      category: "logical"
    }
  ];

  // Interest & Motivation Questions
  const interestQuestions: Question[] = [
    {
      id: "i1",
      text: "Which activity would you most enjoy?",
      options: [
        "Solving complex mathematical problems",
        "Creating art or music",
        "Leading a team project",
        "Researching new scientific discoveries"
      ],
      correctAnswer: 0,
      category: "interest"
    },
    {
      id: "i2",
      text: "What motivates you most in your studies?",
      options: [
        "Getting high grades and recognition",
        "Understanding how things work",
        "Helping others and making a difference",
        "Exploring creative possibilities"
      ],
      correctAnswer: 0,
      category: "interest"
    },
    {
      id: "i3",
      text: "Which subject area interests you most?",
      options: [
        "Science and Technology",
        "Arts and Humanities",
        "Business and Economics",
        "Social Sciences"
      ],
      correctAnswer: 0,
      category: "interest"
    },
    {
      id: "i4",
      text: "How do you prefer to learn new concepts?",
      options: [
        "Through hands-on experiments",
        "By reading and analyzing",
        "Through group discussions",
        "By creating projects"
      ],
      correctAnswer: 0,
      category: "interest"
    },
    {
      id: "i5",
      text: "What type of career appeals to you most?",
      options: [
        "Engineering or Technical roles",
        "Creative or Artistic fields",
        "Management or Leadership positions",
        "Research or Academic careers"
      ],
      correctAnswer: 0,
      category: "interest"
    },
    {
      id: "i6",
      text: "How do you handle academic stress?",
      options: [
        "I plan ahead and stay organized",
        "I take breaks and practice mindfulness",
        "I seek help from teachers or peers",
        "I focus on understanding rather than memorizing"
      ],
      correctAnswer: 0,
      category: "interest"
    },
    {
      id: "i7",
      text: "What excites you about the future?",
      options: [
        "Technological advancements",
        "Cultural and social changes",
        "Economic opportunities",
        "Environmental solutions"
      ],
      correctAnswer: 0,
      category: "interest"
    },
    {
      id: "i8",
      text: "How do you approach problem-solving?",
      options: [
        "I analyze step by step",
        "I brainstorm creative solutions",
        "I collaborate with others",
        "I research and gather information"
      ],
      correctAnswer: 0,
      category: "interest"
    }
  ];

  const currentQuestions = currentTest === "logical" ? logicalQuestions : interestQuestions;
  const totalQuestions = currentQuestions.length;

  const startTest = (testType: "logical" | "interest") => {
    setCurrentTest(testType);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setStartTime(Date.now());
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const questionId = currentQuestions[currentQuestion].id;
      setAnswers({ ...answers, [questionId]: selectedAnswer });
      
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(answers[currentQuestions[currentQuestion + 1].id] ?? null);
      } else {
        // Test completed
        const timeTaken = Math.round((Date.now() - startTime) / 1000);
        const correctAnswers = currentQuestions.filter((q, index) => {
          const questionId = q.id;
          return answers[questionId] === q.correctAnswer;
        }).length;
        
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        
        const result: TestResult = {
          testType: currentTest!,
          score,
          totalQuestions,
          correctAnswers,
          timeTaken
        };
        
        setTestResults([...testResults, result]);
        
        if (currentTest === "logical") {
          // Start interest test
          setCurrentTest("interest");
          setCurrentQuestion(0);
          setSelectedAnswer(null);
          setStartTime(Date.now());
        } else {
          // Both tests completed
          setIsCompleted(true);
          saveResults([...testResults, result]);
        }
      }
    }
  };

  const saveResults = async (results: TestResult[]) => {
    if (!user) return;

    try {
      // Get student record
      const { data: student } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!student) return;

      // Save individual test responses
      const testData = results.flatMap(result => {
        const questions = result.testType === "logical" ? logicalQuestions : interestQuestions;
        return questions.map((question, index) => ({
          student_id: student.id,
          test_type: result.testType,
          question_id: question.id,
          question_text: question.text,
          selected_answer: question.options[answers[question.id] || 0],
          is_correct: answers[question.id] === question.correctAnswer,
          time_taken: result.timeTaken / totalQuestions
        }));
      });

      await supabase.from("aptitude_tests").insert(testData);

      // Save overall results
      const logicalResult = results.find(r => r.testType === "logical");
      const interestResult = results.find(r => r.testType === "interest");
      
      if (logicalResult && interestResult) {
        const overallScore = Math.round((logicalResult.score + interestResult.score) / 2);
        
        await supabase.from("aptitude_results").insert({
          student_id: student.id,
          logical_score: logicalResult.score,
          interest_score: interestResult.score,
          overall_score: overallScore,
          test_completed_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error saving test results:", error);
    }
  };

  const handleContinue = () => {
    navigate("/ai-coach");
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tests Completed!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Great job! Your aptitude assessment is complete. Let's move on to chat with our AI coach.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {testResults.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {result.testType === "logical" ? (
                        <Brain className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Target className="h-5 w-5 text-purple-600" />
                      )}
                      {result.testType === "logical" ? "Logical Reasoning" : "Interest Profiling"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Score:</span>
                        <Badge variant="secondary">{result.score}%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Correct Answers:</span>
                        <span>{result.correctAnswers}/{result.totalQuestions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time Taken:</span>
                        <span>{Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button
              onClick={handleContinue}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Continue to AI Coach
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
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
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Aptitude Assessment
            </h1>
            <p className="text-xl text-gray-600">
              Take our comprehensive aptitude tests to discover your strengths and interests
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  Logical Reasoning Test
                </CardTitle>
                <CardDescription>
                  Test your analytical thinking, problem-solving skills, and logical reasoning abilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>• 8 questions covering various logical concepts</li>
                  <li>• Pattern recognition and sequence problems</li>
                  <li>• Mathematical reasoning and word problems</li>
                  <li>• Spatial and visual reasoning</li>
                </ul>
                <Button
                  onClick={() => startTest("logical")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Start Logical Test
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-purple-600" />
                  Interest Profiling Test
                </CardTitle>
                <CardDescription>
                  Discover your interests, motivations, and learning preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li>• 8 questions about your interests and goals</li>
                  <li>• Learning style preferences</li>
                  <li>• Career aspirations and motivations</li>
                  <li>• Stress management and study habits</li>
                </ul>
                <Button
                  onClick={() => startTest("interest")}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Start Interest Test
                </Button>
              </CardContent>
            </Card>
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
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {currentTest === "logical" ? "Logical Reasoning Test" : "Interest Profiling Test"}
            </h1>
            <p className="text-lg text-gray-600">
              Question {currentQuestion + 1} of {totalQuestions}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={((currentQuestion + 1) / totalQuestions) * 100} className="h-2" />
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
                value={selectedAnswer?.toString()}
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
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
              onClick={() => navigate("/marks")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marks
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {currentQuestion === totalQuestions - 1 ? "Finish Test" : "Next Question"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AptitudeTest;