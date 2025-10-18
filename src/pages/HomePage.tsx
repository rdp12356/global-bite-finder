import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  BookOpen, 
  GraduationCap, 
  MessageCircle, 
  Target, 
  Users,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react'

const features = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Smart Marks Analysis",
    description: "Upload your marksheet or enter manually. Our AI analyzes your academic performance across subjects."
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "Dual Aptitude Tests",
    description: "Take our logical reasoning and interest profiling tests to discover your true potential."
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "AI Career Coach",
    description: "Chat with our AI mentor who understands your academic profile and emotional well-being."
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Personalized Recommendations",
    description: "Get tailored stream and college recommendations based on your unique profile."
  }
]

const steps = [
  {
    number: "01",
    title: "Enter Your Marks",
    description: "Upload marksheet or enter manually"
  },
  {
    number: "02", 
    title: "Take Aptitude Tests",
    description: "Complete logical reasoning & interest tests"
  },
  {
    number: "03",
    title: "Chat with AI Coach",
    description: "Have a conversation with your AI mentor"
  },
  {
    number: "04",
    title: "Get Recommendations",
    description: "Receive personalized stream & college suggestions"
  }
]

const testimonials = [
  {
    name: "Priya Sharma",
    class: "Class 12, Delhi",
    content: "Zertainity helped me discover my passion for computer science. The AI coach was incredibly insightful!",
    rating: 5
  },
  {
    name: "Arjun Patel", 
    class: "Class 12, Mumbai",
    content: "I was confused between Commerce and Arts. The personalized recommendations made everything clear.",
    rating: 5
  },
  {
    name: "Sneha Reddy",
    class: "Class 12, Bangalore", 
    content: "The aptitude tests revealed strengths I never knew I had. Highly recommend to all students!",
    rating: 5
  }
]

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge variant="secondary" className="mb-4">
                <Star className="h-3 w-3 mr-1" />
                AI-Powered Educational Guidance
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Choose with Confidence
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Your AI Mentor for Smarter Academic Choices. Get personalized stream and college recommendations based on your marks, aptitude, and interests.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate(user ? '/dashboard' : '/auth')}
                  className="text-lg px-8 py-6"
                >
                  {user ? 'Go to Dashboard' : 'Get Started Free'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/#how-it-works')}
                  className="text-lg px-8 py-6"
                >
                  How It Works
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our 4-step process helps you make the best academic decisions
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform translate-x-4"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Zertainity?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine AI technology with educational expertise to guide your academic journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Students Say</h2>
            <p className="text-xl text-muted-foreground">
              Real feedback from students who found their path with Zertainity
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.class}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Find Your Path?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of students who have made confident academic decisions with Zertainity
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              className="text-lg px-8 py-6"
            >
              {user ? 'Continue Your Journey' : 'Start Your Journey Today'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Zertainity</h3>
              <p className="text-gray-400">
                Your AI mentor for smarter academic choices. Choose with confidence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Marks Analysis</li>
                <li>Aptitude Tests</li>
                <li>AI Coach</li>
                <li>Recommendations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>Instagram</li>
                <li>YouTube</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Zertainity. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}