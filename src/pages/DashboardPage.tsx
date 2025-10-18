import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Brain, 
  MessageCircle, 
  Target, 
  CheckCircle,
  ArrowRight,
  User,
  Settings,
  LogOut
} from 'lucide-react'

const steps = [
  {
    id: 'marks',
    title: 'Marks Input',
    description: 'Enter your academic marks',
    icon: <BookOpen className="h-5 w-5" />,
    completed: false,
    path: '/marks'
  },
  {
    id: 'aptitude',
    title: 'Aptitude Tests',
    description: 'Take logical reasoning & interest tests',
    icon: <Brain className="h-5 w-5" />,
    completed: false,
    path: '/aptitude-test'
  },
  {
    id: 'chat',
    title: 'AI Chat Coach',
    description: 'Chat with your AI mentor',
    icon: <MessageCircle className="h-5 w-5" />,
    completed: false,
    path: '/ai-chat'
  },
  {
    id: 'recommendations',
    title: 'Get Recommendations',
    description: 'View personalized suggestions',
    icon: <Target className="h-5 w-5" />,
    completed: false,
    path: '/recommendations'
  }
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const completedSteps = 0 // This would come from user data
  const progress = (completedSteps / steps.length) * 100

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">Zertainity</h1>
              <Badge variant="secondary">Dashboard</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'Student'}! 👋
          </h2>
          <p className="text-muted-foreground text-lg">
            Let's continue your journey to find the perfect academic path.
          </p>
        </motion.div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Your Progress
              </CardTitle>
              <CardDescription>
                Complete all steps to get your personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">{completedSteps}/{steps.length} completed</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {completedSteps === 0 
                    ? "Let's get started with entering your marks!"
                    : completedSteps === steps.length
                    ? "Congratulations! You've completed all steps."
                    : "Great progress! Keep going to unlock your recommendations."
                  }
                </p>
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
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Card 
                className={`h-full cursor-pointer transition-all hover:shadow-lg ${
                  step.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'hover:border-blue-300'
                }`}
                onClick={() => navigate(step.path)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {step.completed ? <CheckCircle className="h-5 w-5" /> : step.icon}
                    </div>
                    {step.completed && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    variant={step.completed ? "outline" : "default"}
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(step.path)
                    }}
                  >
                    {step.completed ? 'View Details' : 'Start Now'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/marks')}
                >
                  <BookOpen className="h-6 w-6" />
                  <span>Update Marks</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/ai-chat')}
                >
                  <MessageCircle className="h-6 w-6" />
                  <span>Chat with AI</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/recommendations')}
                >
                  <Target className="h-6 w-6" />
                  <span>View Results</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest interactions with Zertainity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Welcome to Zertainity!</p>
                    <p className="text-xs text-muted-foreground">Get started by entering your marks</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Just now</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}