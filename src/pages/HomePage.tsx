import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowRight, 
  Brain, 
  BookOpen, 
  Users, 
  Target, 
  Sparkles,
  Search,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Heart,
  Award,
  Clock,
  BarChart3,
  CheckCircle,
  Star,
  Play,
  ArrowDown,
  ChevronRight,
  GraduationCap,
  Briefcase,
  DollarSign,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Smart Marks Analysis",
      description: "Upload your marksheet or enter marks manually. Our AI analyzes your academic performance to understand your strengths.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Personalized Aptitude Tests",
      description: "Take our adaptive tests with personalized questions to discover your logical reasoning abilities and interests.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "AI Career Coach",
      description: "Chat with our AI mentor who understands your academic profile, emotional well-being, and career aspirations.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Target className="h-8 w-8 text-orange-600" />,
      title: "Detailed Career Paths",
      description: "Get comprehensive guidance including college recommendations, cutoffs, fees, and step-by-step preparation plans.",
      color: "from-orange-500 to-orange-600"
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Enter Your Marks",
      description: "Upload marksheet with OCR or enter marks manually",
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      number: "02", 
      title: "Take Personalized Tests",
      description: "Complete adaptive aptitude and interest assessments",
      icon: <Brain className="h-6 w-6" />
    },
    {
      number: "03",
      title: "Chat with AI Coach",
      description: "Have a natural conversation with our AI mentor",
      icon: <Users className="h-6 w-6" />
    },
    {
      number: "04",
      title: "Get Career Guidance",
      description: "Receive detailed career paths and college recommendations",
      icon: <Target className="h-6 w-6" />
    },
  ];

  const stats = [
    { number: "10K+", label: "Students Helped", icon: <Users className="h-5 w-5" /> },
    { number: "95%", label: "Success Rate", icon: <Award className="h-5 w-5" /> },
    { number: "500+", label: "Colleges Covered", icon: <GraduationCap className="h-5 w-5" /> },
    { number: "24/7", label: "AI Support", icon: <Zap className="h-5 w-5" /> },
  ];

  const careerExamples = [
    {
      profession: "IAS Officer",
      description: "Civil service with detailed preparation roadmap",
      subjects: ["Public Administration", "History", "Geography"],
      colleges: "Delhi University, JNU",
      salary: "₹56K - ₹2.5L/month"
    },
    {
      profession: "Doctor", 
      description: "Medical career with NEET guidance",
      subjects: ["Physics", "Chemistry", "Biology"],
      colleges: "AIIMS, MAMC",
      salary: "₹60K - ₹5L/month"
    },
    {
      profession: "Engineer",
      description: "Technical career with JEE preparation",
      subjects: ["Math", "Physics", "Chemistry"],
      colleges: "IITs, NITs",
      salary: "₹4L - ₹20L/year"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-4 text-sm px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Educational Guidance Platform
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Zertainity
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-4 max-w-4xl mx-auto font-medium">
              Choose with Confidence — Your AI Mentor for Smarter Academic Choices
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
              Discover the perfect stream for Class 11, ideal colleges for Class 12, and detailed career paths with comprehensive guidance including cutoffs, fees, and preparation steps.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search for careers (e.g., IAS, Doctor, Engineer...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500"
                />
                <Button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-6"
                  onClick={() => navigate("/aptitude")}
                >
                  Search
                </Button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
              >
                {user ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-2 hover:bg-gray-50"
                onClick={() => navigate("/marks")}
              >
                <Play className="mr-2 h-5 w-5" />
                Try Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How Zertainity Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-driven platform combines your academic performance, aptitude, interests, and career goals to provide comprehensive guidance.
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
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-base leading-relaxed">
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
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Journey to the Right Choice
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple steps to discover your ideal academic and career path.
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
                <Card className="h-full text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                  <CardHeader>
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      {step.number}
                    </div>
                    <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                    <div className="flex justify-center mb-2 text-blue-600">
                      {step.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
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

      {/* Career Examples */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Detailed Career Guidance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get comprehensive information about your dream career including colleges, cutoffs, fees, and preparation steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {careerExamples.map((career, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{career.profession}</CardTitle>
                        <Badge variant="secondary">Popular Choice</Badge>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {career.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Key Subjects:</h4>
                        <div className="flex flex-wrap gap-1">
                          {career.subjects.map((subject, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <GraduationCap className="h-4 w-4" />
                        <span>{career.colleges}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>{career.salary}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4 group-hover:bg-blue-700 transition-colors"
                      onClick={() => navigate("/aptitude")}
                    >
                      Explore Career Path
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Discover Your Perfect Academic Path?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of students who have made confident decisions with Zertainity. Get detailed career guidance, college recommendations, and step-by-step preparation plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate(user ? "/dashboard" : "/auth")}
              >
                {user ? "Continue Your Journey" : "Start Your Journey Today"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                onClick={() => navigate("/aptitude")}
              >
                Explore Careers
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;