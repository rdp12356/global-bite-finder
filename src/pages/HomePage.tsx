import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, BookOpen, Target, Users, Zap, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Smart Marks Analysis",
      description: "Upload your marksheet or enter marks manually. Our AI analyzes your academic performance to understand your strengths.",
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Dual Aptitude Tests",
      description: "Take our comprehensive logical reasoning and interest profiling tests to discover your true potential.",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "AI Career Coach",
      description: "Chat with our AI mentor who understands your academic profile, interests, and emotional well-being.",
    },
    {
      icon: <Target className="h-8 w-8 text-orange-600" />,
      title: "Personalized Recommendations",
      description: "Get tailored stream and college recommendations based on your unique profile and aspirations.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Enter Your Marks",
      description: "Upload marksheet or enter marks manually",
    },
    {
      number: "02",
      title: "Take Aptitude Tests",
      description: "Complete logical and interest profiling tests",
    },
    {
      number: "03",
      title: "Chat with AI Coach",
      description: "Have a conversation with our AI mentor",
    },
    {
      number: "04",
      title: "Get Recommendations",
      description: "Receive personalized stream and college suggestions",
    },
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
              🎓 AI-Powered Educational Guidance
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Choose with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Confidence
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your AI mentor for smarter academic choices. Get personalized stream and college recommendations 
              based on your marks, aptitude, interests, and emotional well-being.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate(user ? "/marks" : "/auth")}
                className="text-lg px-8 py-6"
              >
                {user ? "Start Your Journey" : "Get Started Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => navigate("/recommendations")}
              >
                View Sample Results
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
              Our comprehensive approach combines academic analysis, aptitude testing, and AI coaching 
              to provide the most accurate recommendations.
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
              Your Journey to the Right Choice
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to discover your ideal academic path.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full text-2xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform translate-x-4" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Discover Your Perfect Path?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of students who have made confident academic choices with Zertainity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate(user ? "/marks" : "/auth")}
                className="text-lg px-8 py-6"
              >
                <Zap className="mr-2 h-5 w-5" />
                Start Now - It's Free
              </Button>
            </div>
            <div className="flex items-center justify-center mt-8 text-sm text-gray-500">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              No credit card required • Takes only 15 minutes
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
