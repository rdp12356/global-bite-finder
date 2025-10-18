import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, Target, Users, BookOpen, GraduationCap, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Analysis",
      description: "Advanced AI analyzes your marks, aptitude, and interests to provide personalized guidance."
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Stream Selection",
      description: "Get recommendations for the perfect Class 11 stream based on your strengths and interests."
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-purple-600" />,
      title: "College Matching",
      description: "Find the best colleges and courses that match your academic profile and career goals."
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "AI Career Coach",
      description: "Interactive conversations with our AI coach to understand your emotional well-being and mindset."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Enter Your Marks",
      description: "Upload your marksheet or enter marks manually. Our OCR technology extracts data automatically.",
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      number: "02",
      title: "Take Aptitude Tests",
      description: "Complete our dual aptitude assessment covering logical reasoning and interest profiling.",
      icon: <Brain className="h-6 w-6" />
    },
    {
      number: "03",
      title: "Chat with AI Coach",
      description: "Have a natural conversation with our AI mentor to understand your goals and concerns.",
      icon: <Users className="h-6 w-6" />
    },
    {
      number: "04",
      title: "Get Recommendations",
      description: "Receive personalized stream and college recommendations with detailed explanations.",
      icon: <Lightbulb className="h-6 w-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              🎓 AI-Driven Educational Guidance
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Choose with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Confidence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your AI mentor for smarter academic choices. Get personalized guidance for stream selection and college matching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => navigate(user ? "/marks" : "/auth")}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 left-10 opacity-20"
        >
          <div className="w-20 h-20 bg-blue-200 rounded-full"></div>
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-40 right-20 opacity-20"
        >
          <div className="w-16 h-16 bg-purple-200 rounded-full"></div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Zertainity?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine advanced AI technology with educational expertise to provide you with the most accurate and personalized guidance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our simple 4-step process helps you make the best academic decisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex justify-center mb-2">
                      {step.icon}
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Make the Right Choice?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who have found their perfect academic path with Zertainity.
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => navigate(user ? "/marks" : "/auth")}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;