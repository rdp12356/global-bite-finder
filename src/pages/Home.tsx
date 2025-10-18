import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, BookOpen, GraduationCap, Target, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Smart Marks Analysis",
      description: "Upload your marksheet or enter marks manually. Our AI analyzes your academic performance across all subjects."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Dual Aptitude Tests",
      description: "Take our comprehensive tests covering logical reasoning and interest profiling to discover your true potential."
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "AI Career Coach",
      description: "Chat with our AI mentor who understands your academic profile and guides you through personalized conversations."
    },
    {
      icon: <Target className="h-8 w-8 text-orange-600" />,
      title: "Personalized Recommendations",
      description: "Get tailored stream and college recommendations based on your marks, aptitude, interests, and emotional profile."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Enter Your Marks",
      description: "Upload marksheet image or enter marks manually across all subjects"
    },
    {
      number: "02", 
      title: "Take Aptitude Tests",
      description: "Complete our dual assessment covering logical reasoning and interest profiling"
    },
    {
      number: "03",
      title: "Chat with AI Coach",
      description: "Have a natural conversation with our AI mentor about your goals and aspirations"
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
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Zertainity
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-gray-700">
                Choose with Confidence
              </p>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Your AI Mentor for Smarter Academic Choices. Discover the perfect stream and college 
                through intelligent analysis of your marks, aptitude, and aspirations.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => navigate(user ? "/marks" : "/auth")}
              >
                {user ? "Start Your Journey" : "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Zertainity?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform combines academic analysis, psychological profiling, 
              and personalized guidance to help you make the best educational decisions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full text-center p-6 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our 4-step process ensures you get the most accurate and personalized recommendations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full p-6 text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      {step.number}
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform -translate-y-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-white">
              Ready to Discover Your Perfect Path?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join thousands of students who have made confident academic decisions 
              with Zertainity's AI-powered guidance.
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => navigate(user ? "/marks" : "/auth")}
            >
              {user ? "Continue Your Journey" : "Start Now - It's Free"}
              <GraduationCap className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;