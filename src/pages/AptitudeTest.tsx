import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Target,
  Lightbulb,
  Users,
  User,
  GraduationCap,
  Briefcase,
  Star,
  MapPin,
  DollarSign,
  BookOpen,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Question {
  id: string;
  text: string;
  type: 'logical' | 'interest' | 'career_goal' | 'personal';
  options?: Record<string, string>;
  inputType?: 'text' | 'textarea' | 'select';
  placeholder?: string;
  difficulty: number;
  category: string;
  isRequired?: boolean;
}

interface CareerPath {
  profession: string;
  description: string;
  subjects: string[];
  colleges: {
    name: string;
    location: string;
    cutoff: string;
    fees: string;
    rating: number;
    website: string;
  }[];
  preparation: {
    steps: string[];
    timeline: string;
    resources: string[];
  };
  careerProgression: {
    entry: string;
    mid: string;
    senior: string;
    salary: {
      entry: string;
      mid: string;
      senior: string;
    };
  };
}

const AptitudeTest = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentTest, setCurrentTest] = useState<'logical' | 'interest' | 'career_goal' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(300);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [careerGoal, setCareerGoal] = useState<string>("");
  const [careerPath, setCareerPath] = useState<CareerPath | null>(null);
  const [showCareerPath, setShowCareerPath] = useState(false);

  // Personalized questions based on user input
  const getPersonalizedQuestions = (testType: string): Question[] => {
    const baseQuestions = {
      logical: [
        {
          id: "1",
          text: "If you have to solve a complex math problem, what's your first approach?",
          type: "logical" as const,
          options: {
            A: "Break it down into smaller parts",
            B: "Look for patterns or formulas",
            C: "Try different methods until one works",
            D: "Ask for help or look up solutions"
          },
          difficulty: 2,
          category: "problem_solving"
        },
        {
          id: "2",
          text: "When faced with a logical puzzle, you prefer:",
          type: "logical" as const,
          options: {
            A: "Visual diagrams and charts",
            B: "Step-by-step written analysis",
            C: "Trial and error approach",
            D: "Collaborative discussion"
          },
          difficulty: 2,
          category: "reasoning_style"
        }
      ],
      interest: [
        {
          id: "3",
          text: "What type of activities energize you the most?",
          type: "interest" as const,
          options: {
            A: "Creative projects and artistic expression",
            B: "Analytical problem-solving and research",
            C: "Social interaction and helping others",
            D: "Technical building and hands-on work"
          },
          difficulty: 1,
          category: "energy_sources"
        },
        {
          id: "4",
          text: "In your free time, you would most likely:",
          type: "interest" as const,
          options: {
            A: "Read books or watch documentaries",
            B: "Play strategy games or puzzles",
            C: "Meet friends or volunteer",
            D: "Build or create something practical"
          },
          difficulty: 1,
          category: "leisure_preferences"
        }
      ],
      career_goal: [
        {
          id: "5",
          text: "What is your dream profession?",
          type: "career_goal" as const,
          inputType: "text" as const,
          placeholder: "e.g., IAS Officer, Doctor, Engineer, Lawyer, etc.",
          difficulty: 1,
          category: "career_aspiration",
          isRequired: true
        },
        {
          id: "6",
          text: "What motivates you to pursue this career?",
          type: "career_goal" as const,
          inputType: "textarea" as const,
          placeholder: "Tell us about your passion and motivation...",
          difficulty: 1,
          category: "motivation",
          isRequired: true
        },
        {
          id: "7",
          text: "What are your biggest concerns about this career path?",
          type: "career_goal" as const,
          inputType: "textarea" as const,
          placeholder: "Share any worries or challenges you foresee...",
          difficulty: 1,
          category: "concerns",
          isRequired: false
        }
      ]
    };

    return baseQuestions[testType as keyof typeof baseQuestions] || [];
  };

  // Mock career path data - in real app, this would come from AI/API
  const getCareerPathData = (profession: string): CareerPath => {
    const careerPaths: Record<string, CareerPath> = {
      "IAS Officer": {
        profession: "Indian Administrative Service (IAS)",
        description: "Civil service officers who work in various government departments and play a crucial role in policy implementation and administration.",
        subjects: ["Public Administration", "Political Science", "History", "Geography", "Economics", "Current Affairs"],
        colleges: [
          {
            name: "Delhi University",
            location: "New Delhi",
            cutoff: "95%+ in Class 12",
            fees: "₹15,000-25,000/year",
            rating: 4.8,
            website: "https://du.ac.in"
          },
          {
            name: "Jawaharlal Nehru University",
            location: "New Delhi", 
            cutoff: "90%+ in Class 12",
            fees: "₹10,000-20,000/year",
            rating: 4.7,
            website: "https://jnu.ac.in"
          },
          {
            name: "University of Mumbai",
            location: "Mumbai",
            cutoff: "85%+ in Class 12",
            fees: "₹20,000-35,000/year",
            rating: 4.5,
            website: "https://mu.ac.in"
          }
        ],
        preparation: {
          steps: [
            "Complete Class 12 with 90%+ marks",
            "Choose Arts/Humanities stream for Class 11-12",
            "Start preparing for UPSC from Class 12",
            "Join coaching institute for guidance",
            "Read newspapers daily for current affairs",
            "Practice answer writing regularly",
            "Take mock tests and previous year papers"
          ],
          timeline: "2-3 years of dedicated preparation after Class 12",
          resources: [
            "NCERT books (Class 6-12)",
            "Laxmikant for Indian Polity",
            "Spectrum for Modern History",
            "The Hindu newspaper",
            "Yojana and Kurukshetra magazines"
          ]
        },
        careerProgression: {
          entry: "Assistant Collector (SDM)",
          mid: "District Collector (DM)",
          senior: "Secretary to Government of India",
          salary: {
            entry: "₹56,100-1,32,000/month",
            mid: "₹1,18,500-2,14,100/month", 
            senior: "₹2,25,000-2,50,000/month"
          }
        }
      },
      "Doctor": {
        profession: "Medical Doctor",
        description: "Healthcare professionals who diagnose, treat, and prevent diseases, working in hospitals, clinics, or private practice.",
        subjects: ["Physics", "Chemistry", "Biology", "English"],
        colleges: [
          {
            name: "AIIMS Delhi",
            location: "New Delhi",
            cutoff: "99%+ in NEET",
            fees: "₹1,500-2,000/year",
            rating: 4.9,
            website: "https://aiims.edu"
          },
          {
            name: "Maulana Azad Medical College",
            location: "New Delhi",
            cutoff: "95%+ in NEET", 
            fees: "₹10,000-15,000/year",
            rating: 4.7,
            website: "https://mamc.ac.in"
          },
          {
            name: "King George's Medical University",
            location: "Lucknow",
            cutoff: "90%+ in NEET",
            fees: "₹20,000-30,000/year",
            rating: 4.6,
            website: "https://kgmu.org"
          }
        ],
        preparation: {
          steps: [
            "Complete Class 12 with Physics, Chemistry, Biology",
            "Score 90%+ in Class 12 board exams",
            "Prepare for NEET entrance exam",
            "Score 600+ in NEET for top colleges",
            "Complete 5.5 years MBBS course",
            "Complete 1 year internship",
            "Choose specialization (MD/MS) if desired"
          ],
          timeline: "6-8 years total (5.5 years MBBS + 1 year internship + 3 years specialization)",
          resources: [
            "NCERT Physics, Chemistry, Biology (Class 11-12)",
            "NEET preparation books",
            "Previous year NEET papers",
            "Online coaching platforms",
            "Medical journals and case studies"
          ]
        },
        careerProgression: {
          entry: "Junior Resident Doctor",
          mid: "Senior Resident/Specialist",
          senior: "Consultant/Professor",
          salary: {
            entry: "₹60,000-80,000/month",
            mid: "₹1,00,000-2,00,000/month",
            senior: "₹2,00,000-5,00,000/month"
          }
        }
      }
    };

    return careerPaths[profession] || careerPaths["IAS Officer"];
  };

  const currentQuestions = getPersonalizedQuestions(currentTest || '');
  const currentQ = currentQuestions[currentQuestion];

  useEffect(() => {
    if (currentTest && timeLeft > 0 && currentTest !== 'interest' && currentTest !== 'career_goal') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentTest !== 'interest' && currentTest !== 'career_goal') {
      handleNextQuestion();
    }
  }, [timeLeft, currentTest]);

  const startTest = (testType: 'logical' | 'interest' | 'career_goal') => {
    setCurrentTest(testType);
    setCurrentQuestion(0);
    setTimeLeft(300);
    setSelectedAnswer("");
    setTextAnswer("");
    setTestResults([]);
    setQuestionStartTime(Date.now());
    setIsTestComplete(false);
    setShowCareerPath(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleTextChange = (text: string) => {
    setTextAnswer(text);
  };

  const handleNextQuestion = () => {
    if (currentQ.inputType) {
      if (currentQ.isRequired && !textAnswer.trim()) {
        toast({
          title: "Answer required",
          description: "Please provide an answer before proceeding.",
          variant: "destructive",
        });
        return;
      }
    } else if (!selectedAnswer) {
      toast({
        title: "Answer required", 
        description: "Please select an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    const result = {
      questionId: currentQ.id,
      selectedAnswer: currentQ.inputType ? textAnswer : selectedAnswer,
      timeTaken,
      questionType: currentQ.type,
      category: currentQ.category
    };
    
    setTestResults([...testResults, result]);

    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
      setTextAnswer("");
      setTimeLeft(300);
      setQuestionStartTime(Date.now());
    } else {
      if (currentTest === 'career_goal') {
        const careerGoalAnswer = testResults.find(r => r.questionId === '5')?.selectedAnswer || textAnswer;
        setCareerGoal(careerGoalAnswer);
        setCareerPath(getCareerPathData(careerGoalAnswer));
        setShowCareerPath(true);
      }
      setIsTestComplete(true);
      toast({
        title: "Test completed!",
        description: `You've finished the ${currentTest} assessment.`,
      });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer("");
      setTextAnswer("");
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
        description: "Your assessment results have been recorded.",
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

  if (showCareerPath && careerPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <GraduationCap className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Career Path: {careerPath.profession}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {careerPath.description}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Subjects Required */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Subjects to Focus On
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {careerPath.subjects.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Career Progression */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Career Progression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Entry Level:</span>
                    <span className="text-sm text-gray-600">{careerPath.careerProgression.entry}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Mid Level:</span>
                    <span className="text-sm text-gray-600">{careerPath.careerProgression.mid}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Senior Level:</span>
                    <span className="text-sm text-gray-600">{careerPath.careerProgression.senior}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Colleges */}
          <Card className="mb-8 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-purple-600" />
                Recommended Colleges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {careerPath.colleges.map((college, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{college.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{college.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {college.location}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cutoff:</span>
                        <span className="font-medium">{college.cutoff}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fees:</span>
                        <span className="font-medium flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {college.fees}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => window.open(college.website, '_blank')}
                    >
                      Visit Website
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preparation Steps */}
          <Card className="mb-8 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Preparation Roadmap
              </CardTitle>
              <CardDescription>
                Timeline: {careerPath.preparation.timeline}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Step-by-Step Process:</h4>
                  <ol className="space-y-2">
                    {careerPath.preparation.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Recommended Resources:</h4>
                  <ul className="space-y-2">
                    {careerPath.preparation.resources.map((resource, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span className="text-sm">{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Information */}
          <Card className="mb-8 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Salary Expectations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Entry Level</h4>
                  <p className="text-2xl font-bold text-green-600">{careerPath.careerProgression.salary.entry}</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Mid Level</h4>
                  <p className="text-2xl font-bold text-blue-600">{careerPath.careerProgression.salary.mid}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Senior Level</h4>
                  <p className="text-2xl font-bold text-purple-600">{careerPath.careerProgression.salary.senior}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={submitTest} className="flex-1">
              Save Career Path & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setCurrentTest(null);
                setIsTestComplete(false);
                setTestResults([]);
                setShowCareerPath(false);
              }}
              className="flex-1"
            >
              Explore Other Careers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isTestComplete && !showCareerPath) {
    const totalQuestions = testResults.length;
    const completedAnswers = testResults.filter(r => r.selectedAnswer && r.selectedAnswer.trim()).length;

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
              Assessment Completed!
            </h1>
            <p className="text-xl text-gray-600">
              Great job completing the {currentTest} assessment.
            </p>
          </motion.div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{totalQuestions}</p>
                  <p className="text-sm text-gray-500">Questions Asked</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">{completedAnswers}</p>
                  <p className="text-sm text-gray-500">Questions Answered</p>
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
              Take Another Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Personalized Assessment
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take our comprehensive assessments to discover your strengths, interests, and get personalized career guidance. 
              Each assessment is tailored to provide you with actionable insights.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1" onClick={() => startTest('logical')}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Logical Reasoning</CardTitle>
                    <Badge variant="secondary">Adaptive</Badge>
                  </div>
                </div>
                <CardDescription>
                  Test your analytical thinking and problem-solving abilities with personalized questions.
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

            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1" onClick={() => startTest('interest')}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Interest Profiling</CardTitle>
                    <Badge variant="secondary">Personalized</Badge>
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

            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1" onClick={() => startTest('career_goal')}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Career Goals</CardTitle>
                    <Badge variant="secondary">Detailed</Badge>
                  </div>
                </div>
                <CardDescription>
                  Get detailed career path guidance including colleges, cutoffs, fees, and preparation steps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>College recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Fee structure & cutoffs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Complete Profile</CardTitle>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">All Tests</Badge>
                  </div>
                </div>
                <CardDescription>
                  Take all assessments for a comprehensive profile and the best recommendations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    <span>Complete analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>Best recommendations</span>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {currentTest === 'logical' ? 'Logical Reasoning' : 
               currentTest === 'interest' ? 'Interest Profiling' : 
               'Career Goals Assessment'}
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
            {currentTest !== 'interest' && currentTest !== 'career_goal' && (
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(timeLeft)}
              </span>
            )}
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
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{currentQ.text}</CardTitle>
                <CardDescription>
                  {currentTest === 'logical' 
                    ? 'Select the best answer based on your approach'
                    : currentTest === 'interest'
                    ? 'Choose the option that best describes you'
                    : 'Please provide a detailed answer'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentQ.inputType ? (
                  <div className="space-y-4">
                    {currentQ.inputType === 'textarea' ? (
                      <Textarea
                        value={textAnswer}
                        onChange={(e) => handleTextChange(e.target.value)}
                        placeholder={currentQ.placeholder}
                        className="min-h-[120px]"
                      />
                    ) : (
                      <Input
                        value={textAnswer}
                        onChange={(e) => handleTextChange(e.target.value)}
                        placeholder={currentQ.placeholder}
                        className="text-lg"
                      />
                    )}
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedAnswer}
                    onValueChange={handleAnswerSelect}
                    className="space-y-4"
                  >
                    {Object.entries(currentQ.options || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value={key} id={key} />
                        <Label htmlFor={key} className="text-base cursor-pointer flex-1">
                          {value}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="px-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNextQuestion}
            disabled={currentQ.inputType ? !textAnswer.trim() && currentQ.isRequired : !selectedAnswer}
            className="px-6"
          >
            {currentQuestion === currentQuestions.length - 1 ? 'Complete Assessment' : 'Next Question'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AptitudeTest;