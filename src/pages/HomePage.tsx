import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, MessageCircle, Target, Users, Zap } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Smart Marks Analysis",
      description: "Upload your marksheet or enter marks manually. Our AI analyzes your academic performance to understand your strengths."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Dual Aptitude Tests",
      description: "Take our comprehensive aptitude tests covering logical reasoning and interest profiling to discover your true potential."
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-green-600" />,
      title: "AI Career Coach",
      description: "Chat with our AI mentor who understands your academic profile, interests, and emotional well-being to guide your decisions."
    },
    {
      icon: <Target className="h-8 w-8 text-orange-600" />,
      title: "Personalized Recommendations",
      description: "Get tailored stream and college recommendations based on your marks, aptitude, interests, and career aspirations."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Enter Your Marks",
      description: "Upload marksheet image or enter marks manually for all subjects"
    },
    {
      number: "02", 
      title: "Take Aptitude Tests",
      description: "Complete logical reasoning and interest profiling assessments"
    },
    {
      number: "03",
      title: "Chat with AI Coach",
      description: "Have a conversation with our AI mentor about your goals and concerns"
    },
    {
      number: "04",
      title: "Get Recommendations",
      description: "Receive personalized stream and college recommendations with detailed explanations"
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
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Choose with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Confidence
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your AI Mentor for Smarter Academic Choices. Get personalized guidance for Class 11 stream selection and college recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                onClick={() => navigate("/marks")}
              >
                Start Your Journey
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-3 text-lg"
                onClick={() => navigate("/auth")}
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Zertainity Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform combines your academic performance, aptitude, and interests to provide personalized guidance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* Process Steps */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Journey in 4 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow our guided process to discover your ideal academic path.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform translate-x-8" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 text-center"
          >
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Students Guided</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Colleges & Courses</div>
            </div>
          </motion.div>
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
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Discover Your Path?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who have made confident academic decisions with Zertainity.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
              onClick={() => navigate("/marks")}
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
