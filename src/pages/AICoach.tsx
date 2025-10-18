import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, ArrowRight, Brain, Heart, Smile } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
  emotionalTone?: string;
  stressLevel?: number;
}

const AICoach = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      text: "Hello! I'm your AI career coach. I've analyzed your academic performance and aptitude test results. I noticed you scored high in Mathematics - do you enjoy problem-solving and working with numbers?",
      timestamp: new Date(),
      emotionalTone: 'positive'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [emotionalAnalysis, setEmotionalAnalysis] = useState({
    overallTone: 'positive',
    stressLevel: 2,
    confidence: 7,
    motivation: 8
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const aiResponses = [
    {
      triggers: ['yes', 'yeah', 'yep', 'sure', 'i do', 'i enjoy', 'love', 'like'],
      responses: [
        "That's wonderful! Your enthusiasm for problem-solving is a great indicator of success in analytical fields. What specific areas of mathematics interest you most?",
        "Excellent! Your passion for numbers and logic will serve you well. Have you considered how this might translate into your career choices?",
        "I can sense your genuine interest! This is a strong foundation for many career paths. What other subjects do you find engaging?"
      ],
      emotionalTone: 'positive'
    },
    {
      triggers: ['no', 'not really', 'not much', 'not sure', 'maybe', 'sometimes'],
      responses: [
        "That's completely okay! Everyone has different strengths. What subjects or activities do you find more engaging?",
        "No worries at all! Let's explore what truly excites you. What do you enjoy doing in your free time?",
        "That's perfectly normal! Your strengths might lie in other areas. What kind of work do you think you'd find most fulfilling?"
      ],
      emotionalTone: 'neutral'
    },
    {
      triggers: ['stress', 'pressure', 'anxious', 'worried', 'nervous', 'difficult'],
      responses: [
        "I understand that academic pressure can be overwhelming. It's important to remember that your worth isn't defined by grades alone. What strategies help you manage stress?",
        "It's completely normal to feel this way. Many successful people have faced similar challenges. What support systems do you have in place?",
        "Your feelings are valid. Let's focus on what you can control and what brings you joy. What activities help you feel more confident?"
      ],
      emotionalTone: 'supportive'
    },
    {
      triggers: ['future', 'career', 'job', 'profession', 'work', 'college', 'university'],
      responses: [
        "That's a great question! Based on your profile, I see several promising paths. What kind of work environment appeals to you most?",
        "I'm excited to help you explore career options! Do you prefer working with people, data, or creative projects?",
        "Your future is full of possibilities! What values are most important to you in a career - stability, creativity, helping others, or something else?"
      ],
      emotionalTone: 'encouraging'
    },
    {
      triggers: ['help', 'advice', 'guidance', 'suggest', 'recommend', 'what should'],
      responses: [
        "I'm here to help you discover your path! Let's start by understanding what truly motivates you. What gives you the most satisfaction?",
        "Absolutely! I'd love to guide you. Based on what I know about you, let's explore some options. What questions do you have?",
        "That's what I'm here for! Let me ask you this - if you could do anything without worrying about money or what others think, what would it be?"
      ],
      emotionalTone: 'helpful'
    }
  ];

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Find matching response category
    for (const category of aiResponses) {
      if (category.triggers.some(trigger => lowerMessage.includes(trigger))) {
        const randomResponse = category.responses[Math.floor(Math.random() * category.responses.length)];
        return randomResponse;
      }
    }
    
    // Default responses
    const defaultResponses = [
      "That's interesting! Tell me more about that.",
      "I appreciate you sharing that with me. How does that make you feel?",
      "Thank you for being open with me. What else would you like to discuss?",
      "I'm listening. What other thoughts do you have about this?",
      "That's a valuable insight. What led you to think this way?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const analyzeEmotionalTone = (text: string): { tone: string; stressLevel: number } => {
    const lowerText = text.toLowerCase();
    
    // Positive indicators
    const positiveWords = ['excited', 'love', 'enjoy', 'great', 'amazing', 'wonderful', 'fantastic', 'happy', 'confident'];
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    
    // Stress indicators
    const stressWords = ['stress', 'pressure', 'anxious', 'worried', 'nervous', 'difficult', 'hard', 'overwhelming'];
    const stressCount = stressWords.filter(word => lowerText.includes(word)).length;
    
    // Negative indicators
    const negativeWords = ['hate', 'dislike', 'terrible', 'awful', 'bad', 'worried', 'scared'];
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    let tone = 'neutral';
    let stressLevel = 2;
    
    if (positiveCount > negativeCount && positiveCount > 0) {
      tone = 'positive';
      stressLevel = Math.max(1, 3 - positiveCount);
    } else if (negativeCount > 0 || stressCount > 0) {
      tone = 'negative';
      stressLevel = Math.min(5, 2 + stressCount);
    }
    
    return { tone, stressLevel };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText,
      timestamp: new Date(),
      ...analyzeEmotionalTone(inputText)
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: aiResponse,
        timestamp: new Date(),
        emotionalTone: 'positive'
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      // Update emotional analysis
      const analysis = analyzeEmotionalTone(inputText);
      setEmotionalAnalysis(prev => ({
        ...prev,
        overallTone: analysis.tone,
        stressLevel: analysis.stressLevel,
        confidence: Math.max(1, Math.min(10, prev.confidence + (analysis.tone === 'positive' ? 1 : -1))),
        motivation: Math.max(1, Math.min(10, prev.motivation + (analysis.tone === 'positive' ? 1 : 0)))
      }));

      // Check if conversation should end
      if (messages.length >= 8) {
        setTimeout(() => {
          setConversationComplete(true);
        }, 2000);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (conversationComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Conversation Complete!
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Thank you for sharing your thoughts with me. I've gathered valuable insights about your profile.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Emotional Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Overall Tone:</span>
                    <Badge variant={emotionalAnalysis.overallTone === 'positive' ? 'default' : 'secondary'}>
                      {emotionalAnalysis.overallTone}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Stress Level:</span>
                    <span>{emotionalAnalysis.stressLevel}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Confidence:</span>
                    <span>{emotionalAnalysis.confidence}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Motivation:</span>
                    <span>{emotionalAnalysis.motivation}/10</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smile className="h-5 w-5 text-green-500" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Strong analytical thinking abilities</li>
                  <li>• Clear interest in problem-solving</li>
                  <li>• Good communication skills</li>
                  <li>• Open to exploring different options</li>
                  <li>• Realistic about challenges ahead</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/recommendations")}
              className="flex items-center gap-2"
            >
              Get My Recommendations
              <ArrowRight className="h-4 w-4" />
            </Button>
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
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Career Coach
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Let's have a conversation about your academic journey and career aspirations.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Brain className="h-4 w-4 text-blue-500" />
              <span>AI-Powered Analysis</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Emotional Intelligence</span>
            </div>
          </div>
        </motion.div>

        <Card className="h-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              Conversation with AI Coach
            </CardTitle>
            <CardDescription>
              Share your thoughts, concerns, and aspirations. I'm here to help guide you.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea ref={scrollAreaRef} className="h-64 p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.type === 'ai' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                          {message.type === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                          <div>
                            <p className="text-sm">{message.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputText.trim() || isTyping}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={() => navigate("/aptitude")}>
            Back to Aptitude Tests
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
