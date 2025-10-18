import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Bot, User, Loader2, CheckCircle, ArrowRight, Brain, Heart, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AIService, type Message, type ConversationData } from "@/services/aiService";

interface StudentProfile {
  marks: any;
  aptitude: any[];
  interests: string;
  emotionalProfile: {
    confidence: number;
    stressLevel: number;
    motivation: number;
    clarity: number;
  };
}

const AICoach = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load student data
    const marksData = localStorage.getItem('marksData');
    const aptitudeData = localStorage.getItem('aptitudeResults');
    
    if (marksData && aptitudeData) {
      const marks = JSON.parse(marksData);
      const aptitude = JSON.parse(aptitudeData);
      
      setStudentProfile({
        marks,
        aptitude,
        interests: marks.interestArea || '',
        emotionalProfile: {
          confidence: 0.5,
          stressLevel: 0.5,
          motivation: 0.5,
          clarity: 0.5
        }
      });

      // Start conversation
      startConversation(marks, aptitude);
    }
  }, []);

  const startConversation = (marks: any, aptitude: any[]) => {
    const logicalScore = aptitude.find(a => a.testType === 'logical')?.percentage || 0;
    const interestScore = aptitude.find(a => a.testType === 'interest')?.percentage || 0;
    const overallPercentage = marks.overallPercentage || 0;
    const topSubject = marks.subjects?.reduce((max: any, subject: any) => 
      subject.marks > max.marks ? subject : max, marks.subjects[0]
    );

    const initialMessage = `Hello! I'm your AI Career Coach. I've analyzed your academic profile and I'm excited to learn more about you.

I can see that:
• Your overall academic performance is ${overallPercentage.toFixed(1)}%
• You scored ${logicalScore.toFixed(1)}% in logical reasoning
• You scored ${interestScore.toFixed(1)}% in interest profiling
• Your strongest subject appears to be ${topSubject?.name || 'Mathematics'}

I'd love to have a conversation with you to understand your goals, concerns, and aspirations better. This will help me provide more personalized recommendations.

What's on your mind? What are your thoughts about your academic journey so far?`;

    setMessages([{
      id: '1',
      type: 'ai',
      content: initialMessage,
      timestamp: new Date(),
      emotionalTone: 'positive'
    }]);
  };


  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await AIService.generateAIResponse(inputMessage, messages, studentProfile);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        emotionalTone: AIService.analyzeEmotionalTone(aiResponse)
      };

      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);

        // Check if conversation should end
        if (messages.length >= 6) {
          setTimeout(() => {
            setConversationComplete(true);
          }, 2000);
        }
      }, 1500);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContinueToRecommendations = async () => {
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
      // Analyze emotional profile from conversation
      const emotionalProfile = AIService.analyzeEmotionalProfile(messages);
      
      // Store conversation data in localStorage for immediate use
      const conversationData: ConversationData = {
        messages,
        emotionalProfile,
        completedAt: new Date()
      };
      localStorage.setItem('conversationData', JSON.stringify(conversationData));

      // Save to database
      const result = await AIService.saveConversation(user.id, conversationData);
      
      if (result.success) {
        toast({
          title: 'Conversation saved successfully!',
          description: 'Your AI coach session has been recorded.',
        });
        navigate('/recommendations');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error saving conversation',
          description: 'Please try again or contact support.',
        });
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving conversation',
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getEmotionalToneColor = (tone?: string) => {
    switch (tone) {
      case 'positive': return 'text-green-600';
      case 'excited': return 'text-blue-600';
      case 'concerned': return 'text-yellow-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getEmotionalToneIcon = (tone?: string) => {
    switch (tone) {
      case 'positive': return <Heart className="h-4 w-4" />;
      case 'excited': return <Brain className="h-4 w-4" />;
      case 'concerned': return <Target className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              AI Career Coach
            </h1>
            <p className="text-xl text-gray-600">
              Let's have a conversation about your goals and aspirations
            </p>
          </div>

          {/* Chat Container */}
          <Card className="h-[600px] flex flex-col">
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                  >
                    {message.type === 'ai' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                      <div
                        className={`p-4 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      
                      {message.emotionalTone && message.type === 'ai' && (
                        <div className="flex items-center gap-1 mt-2">
                          <div className={`${getEmotionalToneColor(message.emotionalTone)}`}>
                            {getEmotionalToneIcon(message.emotionalTone)}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {message.emotionalTone}
                          </Badge>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    
                    {message.type === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start gap-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input Area */}
            <div className="p-4 border-t">
              {conversationComplete ? (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                  <p className="text-lg font-medium text-gray-900">
                    Great conversation! I have everything I need.
                  </p>
                  <Button 
                    size="lg" 
                    onClick={handleContinueToRecommendations}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        View My Recommendations
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Tips */}
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              <strong>Tip:</strong> Be open and honest in your responses. The more I understand about your goals, 
              concerns, and aspirations, the better I can tailor my recommendations to you.
            </AlertDescription>
          </Alert>
        </motion.div>
      </div>
    </div>
  );
};

export default AICoach;