import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Loader2,
  CheckCircle,
  Brain,
  Heart,
  Lightbulb
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  emotionalTone?: string
}

const aiQuestions = [
  "I noticed you scored high in Mathematics. Do you enjoy problem-solving and working with numbers?",
  "What subjects do you find most interesting and why?",
  "Do you prefer working independently or in groups?",
  "How do you handle academic stress and pressure?",
  "What are your career aspirations? Where do you see yourself in 10 years?",
  "Do you enjoy creative activities like art, music, or writing?",
  "How confident do you feel about your academic abilities?",
  "What motivates you to study and learn new things?",
  "Do you prefer theoretical learning or hands-on practical work?",
  "How important is it for you to make a positive impact on society through your career?"
]

export default function AIChatPage() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [chatComplete, setChatComplete] = useState(false)
  const [emotionalAnalysis, setEmotionalAnalysis] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Start the conversation with AI
    if (messages.length === 0) {
      setTimeout(() => {
        addAIMessage(aiQuestions[0])
      }, 1000)
    }
  }, [])

  const addMessage = (type: 'user' | 'ai', content: string, emotionalTone?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      emotionalTone
    }
    setMessages(prev => [...prev, newMessage])
  }

  const addAIMessage = (content: string) => {
    setIsTyping(true)
    setTimeout(() => {
      addMessage('ai', content)
      setIsTyping(false)
    }, 1500)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    addMessage('user', userMessage)

    // Simulate AI processing
    setIsTyping(true)
    
    setTimeout(() => {
      // Simulate emotional analysis
      const emotionalTone = analyzeEmotionalTone(userMessage)
      
      // Generate AI response
      const aiResponse = generateAIResponse(userMessage, currentQuestionIndex)
      addMessage('ai', aiResponse, emotionalTone)
      
      // Move to next question or complete chat
      if (currentQuestionIndex < aiQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
        setTimeout(() => {
          addAIMessage(aiQuestions[currentQuestionIndex + 1])
        }, 2000)
      } else {
        // Complete the chat and analyze
        setTimeout(() => {
          completeChat()
        }, 2000)
      }
      
      setIsTyping(false)
    }, 2000)
  }

  const analyzeEmotionalTone = (message: string): string => {
    const positiveWords = ['love', 'enjoy', 'excited', 'confident', 'happy', 'great', 'amazing', 'wonderful']
    const negativeWords = ['hate', 'difficult', 'stressed', 'worried', 'anxious', 'confused', 'frustrated', 'hard']
    const neutralWords = ['okay', 'fine', 'average', 'normal', 'regular', 'standard']
    
    const lowerMessage = message.toLowerCase()
    
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length
    const neutralCount = neutralWords.filter(word => lowerMessage.includes(word)).length
    
    if (positiveCount > negativeCount && positiveCount > neutralCount) return 'positive'
    if (negativeCount > positiveCount && negativeCount > neutralCount) return 'negative'
    return 'neutral'
  }

  const generateAIResponse = (userMessage: string, questionIndex: number): string => {
    const responses = [
      "That's interesting! I can see you have a strong analytical mind. This suggests you might excel in fields that require logical thinking.",
      "I understand. Your preference for practical work shows you're a hands-on learner, which is valuable in many career paths.",
      "Thank you for sharing that. Your interest in helping others suggests you might find fulfillment in service-oriented careers.",
      "That's a great perspective! Your confidence in your abilities will serve you well in any field you choose.",
      "I appreciate your honesty. It's normal to feel some uncertainty, and that's exactly why we're here to help guide you.",
      "Your passion for learning is evident! This growth mindset will take you far in your academic and professional journey.",
      "That's wonderful to hear! Your creative side could open up many unique career opportunities you might not have considered.",
      "Your self-awareness about your learning style is impressive. This will help you choose environments where you can thrive.",
      "I can see you're thinking deeply about your future. Your thoughtful approach will lead to good decisions.",
      "Your desire to make a positive impact is admirable. There are many career paths that align with this goal."
    ]
    
    return responses[questionIndex] || "Thank you for sharing that with me. Let's continue exploring your interests and goals."
  }

  const completeChat = () => {
    // Analyze the entire conversation
    const analysis = {
      overallTone: 'positive',
      stressLevel: 3,
      confidenceLevel: 4,
      learningStyle: 'visual',
      interests: ['technology', 'problem-solving'],
      careerGoals: 'To make a positive impact through technology'
    }
    
    setEmotionalAnalysis(analysis)
    setChatComplete(true)
  }

  const handleContinueToRecommendations = () => {
    // Save chat session and analysis to database
    console.log('Saving chat session:', { messages, emotionalAnalysis })
    navigate('/recommendations')
  }

  const getEmotionalToneColor = (tone: string) => {
    switch (tone) {
      case 'positive': return 'text-green-600 bg-green-100'
      case 'negative': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (chatComplete) {
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
                  <h1 className="text-2xl font-bold">Chat Complete!</h1>
                  <p className="text-muted-foreground">Step 3 of 4 - AI Analysis Results</p>
                </div>
              </div>
              <Badge variant="outline">Step 3 of 4</Badge>
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
              <h2 className="text-3xl font-bold mb-2">Analysis Complete!</h2>
              <p className="text-xl text-muted-foreground">
                Our AI has analyzed your responses and emotional tone. Here's what we discovered:
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <Heart className="h-5 w-5 text-pink-600 mr-2" />
                      <h3 className="font-semibold">Emotional Tone</h3>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 capitalize">
                        {emotionalAnalysis?.overallTone}
                      </p>
                      <p className="text-sm text-muted-foreground">Overall Mood</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <Brain className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-semibold">Stress Level</h3>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {emotionalAnalysis?.stressLevel}/5
                      </p>
                      <p className="text-sm text-muted-foreground">Moderate</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
                      <h3 className="font-semibold">Confidence Level</h3>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">
                        {emotionalAnalysis?.confidenceLevel}/5
                      </p>
                      <p className="text-sm text-muted-foreground">High</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <Button size="lg" onClick={handleContinueToRecommendations}>
                Get My Recommendations
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            </motion.div>
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
              <Button variant="ghost" size="sm" onClick={() => navigate('/aptitude-test')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tests
              </Button>
              <div>
                <h1 className="text-2xl font-bold">AI Chat Coach</h1>
                <p className="text-muted-foreground">Step 3 of 4 - Chat with your AI mentor</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Step 3 of 4</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Conversation Progress</span>
              <span className="text-sm text-muted-foreground">
                {currentQuestionIndex + 1} of {aiQuestions.length} questions
              </span>
            </div>
            <Progress value={((currentQuestionIndex + 1) / aiQuestions.length) * 100} className="h-2" />
          </div>

          {/* Chat Messages */}
          <Card className="h-96 mb-6">
            <CardContent className="p-6 h-full overflow-y-auto">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                        <div className={`rounded-lg px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          {message.emotionalTone && (
                            <Badge 
                              variant="secondary" 
                              className={`mt-2 text-xs ${getEmotionalToneColor(message.emotionalTone)}`}
                            >
                              {message.emotionalTone}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>

          {/* Input */}
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your response here..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isTyping}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
            >
              {isTyping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4 text-center">
            Be honest and detailed in your responses. This helps our AI provide better recommendations.
          </p>
        </div>
      </div>
    </div>
  )
}