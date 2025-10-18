import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Brain,
  Heart,
  TrendingUp,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  emotionalTone?: string;
  stressLevel?: number;
}

const AICoach = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start conversation with initial AI message
    if (messages.length === 0) {
      const initialMessage: Message = {
        id: "1",
        type: "ai",
        content: "Hello! I'm your AI career coach. I've reviewed your academic performance and aptitude test results. I'd love to learn more about your interests and aspirations. What subjects do you enjoy most in school?",
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock AI responses based on conversation flow
      const aiResponse = generateAIResponse(inputMessage, messages.length);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse.content,
        timestamp: new Date(),
        emotionalTone: aiResponse.emotionalTone,
        stressLevel: aiResponse.stressLevel,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Check if conversation should end
      if (messages.length >= 8) {
        setTimeout(() => {
          setConversationComplete(true);
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const generateAIResponse = (userInput: string, messageCount: number): { content: string; emotionalTone?: string; stressLevel?: number } => {
    const responses = [
      {
        content: "That's interesting! I can see you have a strong foundation in those subjects. What career paths are you considering?",
        emotionalTone: "encouraging",
        stressLevel: 2
      },
      {
        content: "I understand your concerns about choosing the right path. Many students feel this way. What aspects of your studies excite you the most?",
        emotionalTone: "empathetic",
        stressLevel: 3
      },
      {
        content: "Based on your aptitude test results, you show strong analytical thinking. How do you feel about problem-solving and critical thinking?",
        emotionalTone: "analytical",
        stressLevel: 2
      },
      {
        content: "That's a great perspective! Your interests align well with several promising career paths. What kind of work environment do you prefer?",
        emotionalTone: "positive",
        stressLevel: 1
      },
      {
        content: "I can sense some uncertainty in your response, which is completely normal. What would you say are your biggest strengths?",
        emotionalTone: "supportive",
        stressLevel: 3
      },
      {
        content: "Excellent! Your answers are giving me a clear picture of your profile. How do you handle academic pressure and stress?",
        emotionalTone: "encouraging",
        stressLevel: 2
      },
      {
        content: "Thank you for sharing that with me. Based on our conversation, I'm getting a comprehensive understanding of your academic profile and aspirations.",
        emotionalTone: "grateful",
        stressLevel: 1
      },
      {
        content: "Perfect! I now have all the information I need to provide you with personalized recommendations. Let me analyze your complete profile and prepare your customized guidance.",
        emotionalTone: "confident",
        stressLevel: 1
      }
    ];

    return responses[Math.min(messageCount - 1, responses.length - 1)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getEmotionalToneColor = (tone?: string) => {
    switch (tone) {
      case 'encouraging': return 'text-green-600';
      case 'empathetic': return 'text-blue-600';
      case 'analytical': return 'text-purple-600';
      case 'positive': return 'text-yellow-600';
      case 'supportive': return 'text-pink-600';
      case 'grateful': return 'text-indigo-600';
      case 'confident': return 'text-emerald-600';
      default: return 'text-gray-600';
    }
  };

  const getStressLevelColor = (level?: number) => {
    if (!level) return 'bg-gray-200';
    if (level <= 2) return 'bg-green-200';
    if (level <= 3) return 'bg-yellow-200';
    return 'bg-red-200';
  };

  if (conversationComplete) {
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
              Conversation Complete!
            </h1>
            <p className="text-xl text-gray-600">
              Thank you for sharing your thoughts. I now have a comprehensive understanding of your profile.
            </p>
          </motion.div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-blue-600" />
                Analysis Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Emotional Profile</h3>
                  <p className="text-sm text-gray-600">Confident and motivated</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Stress Level</h3>
                  <p className="text-sm text-gray-600">Well-managed</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Readiness</h3>
                  <p className="text-sm text-gray-600">Ready for recommendations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button size="lg" className="text-lg px-8 py-6">
              View My Recommendations
              <MessageCircle className="ml-2 h-5 w-5" />
            </Button>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Career Coach
          </h1>
          <p className="text-xl text-gray-600">
            Let's have a conversation about your academic interests and career aspirations.
          </p>
        </motion.div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              Chat with Your AI Coach
            </CardTitle>
            <CardDescription>
              Share your thoughts, interests, and concerns. I'm here to help guide you.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`rounded-lg px-4 py-2 ${
                        message.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        {message.emotionalTone && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getEmotionalToneColor(message.emotionalTone)}`}
                            >
                              {message.emotionalTone}
                            </Badge>
                            {message.stressLevel && (
                              <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${getStressLevelColor(message.stressLevel)}`} />
                                <span className="text-xs text-gray-500">
                                  Stress: {message.stressLevel}/5
                                </span>
                              </div>
                            )}
                          </div>
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
                  className="flex gap-3 justify-start"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={sendMessage} 
                disabled={!inputMessage.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AICoach;