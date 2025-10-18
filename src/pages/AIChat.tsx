import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2, MessageCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotionalTone?: string;
  stressLevel?: number;
}

const AIChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: Message[] = [
    {
      id: "1",
      text: "Hello! I'm your AI career coach. I've analyzed your academic performance and aptitude test results. I'm here to help you discover the perfect academic path for your future.",
      sender: 'ai',
      timestamp: new Date(),
      emotionalTone: 'positive'
    },
    {
      id: "2", 
      text: "I noticed you scored well in Mathematics and showed strong logical reasoning skills. What are your thoughts on pursuing a career in technology or engineering?",
      sender: 'ai',
      timestamp: new Date(),
      emotionalTone: 'encouraging'
    }
  ];

  useEffect(() => {
    setMessages(initialMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Integrate with actual AI API (OpenRouter/Groq)
      const aiResponse = generateAIResponse(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'ai',
        timestamp: new Date(),
        emotionalTone: aiResponse.emotionalTone,
        stressLevel: aiResponse.stressLevel
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Sorry, I couldn't process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const generateAIResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    // Simple response generation based on keywords
    if (input.includes('engineering') || input.includes('technology')) {
      return {
        text: "That's excellent! Your strong mathematical foundation and logical thinking make you a great fit for engineering. Have you considered specific branches like Computer Science, Mechanical, or Electrical Engineering?",
        emotionalTone: 'positive',
        stressLevel: 2
      };
    } else if (input.includes('medicine') || input.includes('doctor')) {
      return {
        text: "Medicine is a noble profession! Your analytical skills and interest in helping others align well with this path. What aspects of healthcare interest you most - patient care, research, or specialization?",
        emotionalTone: 'encouraging',
        stressLevel: 2
      };
    } else if (input.includes('business') || input.includes('commerce')) {
      return {
        text: "Business and commerce offer diverse opportunities! Your problem-solving skills would be valuable in entrepreneurship, management, or finance. What type of business environment appeals to you?",
        emotionalTone: 'positive',
        stressLevel: 1
      };
    } else if (input.includes('arts') || input.includes('creative')) {
      return {
        text: "Creative fields are incredibly rewarding! Your unique perspective and interests could lead to amazing opportunities in design, media, or arts. What creative medium excites you most?",
        emotionalTone: 'enthusiastic',
        stressLevel: 1
      };
    } else if (input.includes('stress') || input.includes('worried') || input.includes('anxious')) {
      return {
        text: "I understand this decision feels overwhelming. Remember, choosing a stream is just the beginning of your journey, not the end. You can always explore different paths later. What specific concerns are weighing on your mind?",
        emotionalTone: 'supportive',
        stressLevel: 4
      };
    } else if (input.includes('parents') || input.includes('family')) {
      return {
        text: "Family expectations can add pressure to this decision. It's important to find a balance between their guidance and your own interests. What do you think your family values most in a career choice?",
        emotionalTone: 'understanding',
        stressLevel: 3
      };
    } else if (input.includes('future') || input.includes('career')) {
      return {
        text: "Thinking about the future can be exciting and daunting. The good news is that your skills and interests will continue to evolve. What kind of impact do you want to make in the world?",
        emotionalTone: 'thoughtful',
        stressLevel: 2
      };
    } else {
      return {
        text: "That's interesting! Tell me more about what draws you to that field. I'd love to understand your perspective better and help you explore the possibilities.",
        emotionalTone: 'curious',
        stressLevel: 2
      };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContinueToRecommendations = () => {
    // TODO: Save conversation data to database
    navigate("/recommendations");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              AI Career Coach
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Let's have a conversation about your academic goals and aspirations
          </p>
        </motion.div>

        <Card className="h-[600px] flex flex-col">
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}>
                        {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`rounded-lg px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-600 text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                      <div className="flex items-center gap-1">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
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
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/aptitude")}
            className="px-8"
          >
            Back to Aptitude Tests
          </Button>
          <Button
            onClick={handleContinueToRecommendations}
            className="px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Get My Recommendations
          </Button>
        </div>

        {/* Tips */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Tips for a great conversation:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Be honest about your interests and concerns</li>
              <li>• Ask questions about different career paths</li>
              <li>• Share what motivates you in your studies</li>
              <li>• Discuss any family expectations or pressures</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIChat;
