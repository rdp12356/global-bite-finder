import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Brain, BookOpen, Users, Target, Sparkles } from "lucide-react";
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
      description: "Take our adaptive tests to discover your logical reasoning abilities and personal interests.",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "AI Career Coach",
      description: "Chat with our AI mentor who understands your academic profile and emotional well-being.",
    },
    {
      icon: <Target className="h-8 w-8 text-orange-600" />,
      title: "Personalized Recommendations",
      description: "Get tailored suggestions for Class 11 streams and Class 12 colleges based on your unique profile.",
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
      description: "Complete logical and interest assessments",
    },
    {
      number: "03",
      title: "Chat with AI Coach",
      description: "Have a natural conversation with our AI mentor",
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
            <Badge variant="secondary" className="mb-4 text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Educational Guidance
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Zertainity
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choose with Confidence — Your AI Mentor for Smarter Academic Choices
            </p>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              Discover the perfect stream for Class 11 and the ideal college for Class 12 through our intelligent, personalized guidance system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
              >
                {user ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
                onClick={() => navigate("/marks")}
              >
                Try Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
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
              Our AI-driven platform combines your academic performance, aptitude, and interests to provide personalized guidance.
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
                <Card className="h-full text-center">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
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
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Discover Your Perfect Academic Path?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of students who have made confident decisions with Zertainity.
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
            >
              {user ? "Continue Your Journey" : "Start Your Journey Today"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;