import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, ArrowRight, Brain, Heart, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { aiService } from "@/services/aiService";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  emotionalTone?: string;
  stressLevel?: number;
}

const AICoach = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationComplete, setConversationComplete] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);

  const conversationPhases = [
    {
      title: "Academic Strengths",
      questions: [
        "I noticed you scored well in Mathematics. Do you enjoy problem-solving and working with numbers?",
        "What subjects do you find most interesting and why?",
        "How do you typically approach challenging academic problems?"
      ]
    },
    {
      title: "Learning Preferences",
      questions: [
        "Do you prefer working alone or in groups when studying?",
        "What type of learning environment helps you focus best?",
        "How do you like to organize your study time and materials?"
      ]
    },
    {
      title: "Career Interests",
      questions: [
        "What kind of work do you see yourself doing in the future?",
        "Are you more interested in technical, creative, or people-oriented careers?",
        "What activities or hobbies do you enjoy outside of academics?"
      ]
    },
    {
      title: "Emotional Well-being",
      questions: [
        "How do you handle academic stress and pressure?",
        "What motivates you to keep going when things get difficult?",
        "Do you feel confident about your academic abilities?"
      ]
    }
  ];

  const currentQuestions = conversationPhases[currentPhase]?.questions || [];
  const currentQuestionIndex = messages.filter(m => m.type === "ai").length - 1;

  useEffect(() => {
    // Start the conversation
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: "welcome",
        type: "ai",
        content: "Hello! I'm your AI career coach. I'm here to understand your academic journey and help you make the best decisions for your future. Let's start with a few questions about your academic strengths.",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const analyzeEmotionalTone = (text: string): { tone: string; stressLevel: number } => {
    const positiveWords = ["excited", "love", "enjoy", "confident", "motivated", "happy", "great", "amazing"];
    const negativeWords = ["stressed", "worried", "anxious", "difficult", "hard", "struggle", "confused", "overwhelmed"];
    const stressWords = ["pressure", "stress", "anxiety", "worried", "nervous", "overwhelmed", "burnout"];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    const stressCount = stressWords.filter(word => lowerText.includes(word)).length;
    
    let tone = "neutral";
    if (positiveCount > negativeCount) tone = "positive";
    else if (negativeCount > positiveCount) tone = "negative";
    
    const stressLevel = Math.min(10, stressCount * 2 + (negativeCount > 0 ? 2 : 0));
    
    return { tone, stressLevel };
  };

  const generateAIResponse = async (userMessage: string): Promise<{ content: string; emotionalTone?: string; stressLevel?: number }> => {
    const conversationHistory = messages.map(msg => msg.content);
    return await aiService.generateChatResponse(userMessage, conversationHistory);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponse.content,
        timestamp: new Date(),
        emotionalTone: aiResponse.emotionalTone,
        stressLevel: aiResponse.stressLevel
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating AI response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const saveConversation = async () => {
    if (!user) return;

    try {
      // Get student record
      const { data: student } = await supabase
        .from("students")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!student) return;

      // Save conversation messages
      const conversationData = messages.map(message => ({
        student_id: student.id,
        message_type: message.type,
        content: message.content,
        emotional_tone: message.emotionalTone,
        stress_level: message.stressLevel
      }));

      await supabase.from("ai_conversations").insert(conversationData);
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  };

  const handleContinue = async () => {
    await saveConversation();
    navigate("/recommendations");
  };

  const getPhaseIcon = (phase: number) => {
    const icons = [Brain, Heart, Lightbulb, Heart];
    const Icon = icons[phase] || Brain;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              AI Career Coach
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Let's have a conversation about your academic journey and future goals
            </p>
            
            {/* Phase Indicator */}
            <div className="flex justify-center space-x-4 mb-6">
              {conversationPhases.map((phase, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                    index <= currentPhase
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {getPhaseIcon(index)}
                  <span className="text-sm font-medium">{phase.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <Card className="h-96 mb-6">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`px-4 py-2 rounded-lg ${
                        message.type === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        {message.emotionalTone && (
                          <div className="mt-2 flex space-x-1">
                            <Badge variant="secondary" className="text-xs">
                              {message.emotionalTone}
                            </Badge>
                            {message.stressLevel && message.stressLevel > 3 && (
                              <Badge variant="destructive" className="text-xs">
                                Stress: {message.stressLevel}/10
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="px-4 py-2 rounded-lg bg-gray-100">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>

          {/* Input Area */}
          <div className="flex space-x-4">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response here..."
              className="flex-1 min-h-[60px] resize-none"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Continue Button */}
          {messages.length > 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mt-8"
            >
              <Button
                onClick={handleContinue}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Continue to Recommendations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AICoach;