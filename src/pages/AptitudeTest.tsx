import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, ArrowRight, ArrowLeft, Brain, Target, Clock, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AptitudeService, type AptitudeQuestion, type AptitudeTestResult } from "@/services/aptitudeService";


const AptitudeTest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentTest, setCurrentTest] = useState<'logical' | 'interest' | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [responses, setResponses] = useState<{ questionId: string; selectedAnswer: number; isCorrect: boolean }[]>([]);
  const [testResults, setTestResults] = useState<AptitudeTestResult[]>([]);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get sample questions from service
  const { logical: logicalQuestions, interest: interestQuestions } = AptitudeService.getSampleQuestions();

  const currentQuestions = currentTest === 'logical' ? logicalQuestions : interestQuestions;
  const currentQuestionData = currentQuestions[currentQuestion];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentTest && !showResults) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentTest, showResults]);

  const startTest = (testType: 'logical' | 'interest') => {
    setCurrentTest(testType);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setResponses([]);
    setTimeSpent(0);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const isCorrect = selectedAnswer === currentQuestionData.correctAnswer;
      const newResponse = {
        questionId: currentQuestionData.id,
        selectedAnswer,
        isCorrect
      };
      
      setResponses(prev => [...prev, newResponse]);
      
      if (currentQuestion < currentQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        // Test completed
        const score = responses.filter(r => r.isCorrect).length + (isCorrect ? 1 : 0);
        const result: AptitudeTestResult = {
          testType,
          score,
          maxScore: currentQuestions.length,
          percentage: (score / currentQuestions.length) * 100,
          responses: [...responses, newResponse],
          timeSpent
        };
        
        setTestResults(prev => [...prev, result]);
        
        if (testType === 'logical') {
          // Start interest test
          setCurrentTest('interest');
          setCurrentQuestion(0);
          setSelectedAnswer(null);
          setResponses([]);
          setTimeSpent(0);
        } else {
          // Both tests completed
          setShowResults(true);
        }
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      const previousResponse = responses.find(r => r.questionId === currentQuestions[currentQuestion - 1].id);
      setSelectedAnswer(previousResponse ? previousResponse.selectedAnswer : null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleContinueToCoach = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in to continue.',
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Store test results in localStorage for immediate use
      localStorage.setItem('aptitudeResults', JSON.stringify(testResults));

      // Save to database
      const result = await AptitudeService.saveTestResults(user.id, testResults);
      
      if (result.success) {
        toast({
          title: 'Test results saved successfully!',
          description: 'Your aptitude data has been recorded.',
        });
        navigate('/coach');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error saving test results',
          description: 'Please try again or contact support.',
        });
      }
    } catch (error) {
      console.error('Error saving test results:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving test results',
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <h1 className="text-4xl font-bold text-gray-900">
                Aptitude Tests Completed!
              </h1>
              <p className="text-xl text-gray-600">
                Great job! Here are your results and next steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testResults.map((result) => (
                <Card key={result.testType}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {result.testType === 'logical' ? (
                        <Brain className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Target className="h-5 w-5 text-purple-600" />
                      )}
                      {result.testType === 'logical' ? 'Logical Reasoning' : 'Interest Profiling'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {result.percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {result.score} out of {result.maxScore} correct
                      </div>
                    </div>
                    <Progress value={result.percentage} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Time: {formatTime(result.timeSpent)}</span>
                      <span>Accuracy: {result.percentage.toFixed(1)}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                size="lg" 
                onClick={handleContinueToCoach}
                disabled={isSaving}
                className="px-8 py-6 text-lg"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue to AI Coach
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!currentTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Aptitude Assessment
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Take our comprehensive aptitude tests to discover your strengths and interests. 
                This will help us provide more accurate recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('logical')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-blue-600" />
                    Test A: Logical & Analytical Reasoning
                  </CardTitle>
                  <CardDescription>
                    8 questions testing your logical thinking, problem-solving, and analytical skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Pattern recognition</li>
                    <li>• Mathematical reasoning</li>
                    <li>• Logical deduction</li>
                    <li>• Problem-solving</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => startTest('interest')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-purple-600" />
                    Test B: Interest & Motivation Profiling
                  </CardTitle>
                  <CardDescription>
                    8 questions exploring your interests, motivations, and career preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Career interests</li>
                    <li>• Learning preferences</li>
                    <li>• Work environment</li>
                    <li>• Motivation factors</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> Both tests will be completed in sequence. 
                Take your time to answer thoughtfully - there are no time limits.
              </AlertDescription>
            </Alert>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">
                {currentTest === 'logical' ? 'Logical Reasoning Test' : 'Interest Profiling Test'}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {formatTime(timeSpent)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Question {currentQuestion + 1} of {currentQuestions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / currentQuestions.length) * 100)}% Complete</span>
              </div>
              <Progress value={((currentQuestion + 1) / currentQuestions.length) * 100} className="h-2" />
            </div>
          </div>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  Question {currentQuestion + 1}
                </CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestionData.difficulty)}`}>
                  {currentQuestionData.difficulty.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-800">
                {currentQuestionData.question}
              </p>

              <RadioGroup
                value={selectedAnswer?.toString()}
                onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                className="space-y-3"
              >
                {currentQuestionData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
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
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {currentQuestion === currentQuestions.length - 1 ? 'Finish Test' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AptitudeTest;