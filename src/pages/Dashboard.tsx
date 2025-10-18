import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Brain, 
  MessageCircle, 
  Target, 
  CheckCircle, 
  Clock,
  ArrowRight,
  Upload,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mock data - in real app, this would come from API
  const progress = {
    marksEntered: true,
    aptitudeCompleted: false,
    aiCoachCompleted: false,
    recommendationsReady: false,
  };

  const steps = [
    {
      id: "marks",
      title: "Enter Your Marks",
      description: "Upload your marksheet or enter marks manually",
      completed: progress.marksEntered,
      icon: <BookOpen className="h-6 w-6" />,
      path: "/marks",
    },
    {
      id: "aptitude",
      title: "Take Aptitude Tests",
      description: "Complete logical reasoning and interest profiling tests",
      completed: progress.aptitudeCompleted,
      icon: <Brain className="h-6 w-6" />,
      path: "/aptitude",
    },
    {
      id: "coach",
      title: "Chat with AI Coach",
      description: "Have a conversation with our AI career mentor",
      completed: progress.aiCoachCompleted,
      icon: <MessageCircle className="h-6 w-6" />,
      path: "/coach",
    },
    {
      id: "recommendations",
      title: "Get Recommendations",
      description: "View your personalized stream and college suggestions",
      completed: progress.recommendationsReady,
      icon: <Target className="h-6 w-6" />,
      path: "/recommendations",
    },
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const nextStep = steps.find(step => !step.completed);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.full_name || "Student"}!
          </h1>
          <p className="text-xl text-gray-600">
            Let's continue your journey to finding the perfect academic path.
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-6 w-6 text-blue-600" />
                Your Progress
              </CardTitle>
              <CardDescription>
                Complete all steps to get your personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    {completedSteps} of {steps.length} steps completed
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                {nextStep && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Clock className="h-4 w-4" />
                    Next: {nextStep.title}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card 
                className={`h-full cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  step.completed 
                    ? 'border-green-200 bg-green-50' 
                    : nextStep?.id === step.id 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200'
                }`}
                onClick={() => navigate(step.path)}
              >
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    step.completed 
                      ? 'bg-green-100 text-green-600' 
                      : nextStep?.id === step.id 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.completed ? <CheckCircle className="h-6 w-6" /> : step.icon}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  {step.completed ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  ) : nextStep?.id === step.id ? (
                    <Button size="sm" className="w-full">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      Locked
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to help you progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => navigate("/marks")}
                >
                  <Upload className="h-6 w-6" />
                  <span>Upload Marksheet</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => navigate("/aptitude")}
                >
                  <Brain className="h-6 w-6" />
                  <span>Take Aptitude Test</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => navigate("/coach")}
                >
                  <MessageCircle className="h-6 w-6" />
                  <span>Chat with AI Coach</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;