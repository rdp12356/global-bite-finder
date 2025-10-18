import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  GraduationCap, 
  MapPin, 
  Star, 
  ExternalLink,
  CheckCircle,
  TrendingUp,
  Users,
  BookOpen,
  Brain,
  Heart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface StreamRecommendation {
  id: string;
  name: string;
  description: string;
  confidence: number;
  reasoning: string;
  subjects: string[];
  careerPaths: string[];
  pros: string[];
  cons: string[];
}

interface CollegeRecommendation {
  id: string;
  name: string;
  location: string;
  state: string;
  type: string;
  rating: number;
  website: string;
  cutoff: number;
  courses: string[];
  whyItFits: string;
  pros: string[];
  cons: string[];
}

const Recommendations = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [streamRecommendations, setStreamRecommendations] = useState<StreamRecommendation[]>([]);
  const [collegeRecommendations, setCollegeRecommendations] = useState<CollegeRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading recommendations
    const loadRecommendations = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock data - in real app, this would come from AI analysis
      setStreamRecommendations([
        {
          id: "1",
          name: "Science",
          description: "Focus on Mathematics, Physics, Chemistry, and Biology",
          confidence: 0.92,
          reasoning: "Your strong performance in Mathematics (92%) and Physics (88%) combined with high logical reasoning scores indicate excellent aptitude for science stream.",
          subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
          careerPaths: ["Engineering", "Medicine", "Research", "Technology", "Data Science"],
          pros: [
            "Matches your analytical strengths",
            "High career opportunities",
            "Aligns with your interest in problem-solving"
          ],
          cons: [
            "Requires consistent hard work",
            "Competitive environment"
          ]
        },
        {
          id: "2", 
          name: "Commerce",
          description: "Focus on Business, Economics, and Accountancy",
          confidence: 0.78,
          reasoning: "Your interest in business concepts and good performance in Mathematics suggests potential for commerce stream.",
          subjects: ["Accountancy", "Business Studies", "Economics", "Mathematics", "English"],
          careerPaths: ["Business", "Finance", "Management", "Economics", "Entrepreneurship"],
          pros: [
            "Diverse career options",
            "Practical business knowledge",
            "Good earning potential"
          ],
          cons: [
            "May not match your science strengths",
            "Less technical focus"
          ]
        }
      ]);

      setCollegeRecommendations([
        {
          id: "1",
          name: "Indian Institute of Technology Delhi",
          location: "New Delhi",
          state: "Delhi",
          type: "Government",
          rating: 4.8,
          website: "https://www.iitd.ac.in",
          cutoff: 95.5,
          courses: ["B.Tech Computer Science", "B.Tech Mechanical", "B.Tech Electrical"],
          whyItFits: "Your strong Mathematics and Physics scores, combined with high logical reasoning, make you an ideal candidate for IIT Delhi's rigorous programs.",
          pros: [
            "World-class faculty and facilities",
            "Excellent placement record",
            "Strong alumni network",
            "Research opportunities"
          ],
          cons: [
            "Very high competition",
            "Intensive academic pressure",
            "High cutoff requirements"
          ]
        },
        {
          id: "2",
          name: "Delhi Technological University",
          location: "New Delhi", 
          state: "Delhi",
          type: "Government",
          rating: 4.2,
          website: "https://www.dtu.ac.in",
          cutoff: 88.0,
          courses: ["B.Tech Computer Science", "B.Tech Information Technology", "B.Tech Electronics"],
          whyItFits: "DTU offers excellent engineering programs with a good balance of academics and practical learning, suitable for your technical aptitude.",
          pros: [
            "Good placement opportunities",
            "Reasonable fees",
            "Strong industry connections",
            "Diverse course options"
          ],
          cons: [
            "Competitive admission",
            "Large class sizes",
            "Limited hostel facilities"
          ]
        },
        {
          id: "3",
          name: "St. Stephen's College",
          location: "New Delhi",
          state: "Delhi", 
          type: "Private",
          rating: 4.6,
          website: "https://www.ststephens.edu",
          cutoff: 92.0,
          courses: ["B.Sc Physics", "B.Sc Chemistry", "B.Sc Mathematics", "B.A Economics"],
          whyItFits: "Your strong academic performance and analytical skills align well with St. Stephen's rigorous science programs and research focus.",
          pros: [
            "Excellent faculty",
            "Small class sizes",
            "Strong research culture",
            "Prestigious reputation"
          ],
          cons: [
            "High fees",
            "Very selective admission",
            "Limited engineering options"
          ]
        }
      ]);

      setIsLoading(false);
    };

    loadRecommendations();
  }, []);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800";
    if (confidence >= 0.6) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return "High Match";
    if (confidence >= 0.6) return "Good Match";
    return "Consider";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Analyzing Your Profile
            </h1>
            <p className="text-xl text-gray-600">
              Our AI is processing your academic data, aptitude results, and conversation to generate personalized recommendations...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your Personalized Recommendations
          </h1>
          <p className="text-xl text-gray-600">
            Based on your academic performance, aptitude tests, and interests, here are our AI-powered suggestions.
          </p>
        </motion.div>

        <Tabs defaultValue="streams" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="streams">Class 11 Streams</TabsTrigger>
            <TabsTrigger value="colleges">Class 12 Colleges</TabsTrigger>
          </TabsList>

          <TabsContent value="streams">
            <div className="space-y-6">
              {streamRecommendations.map((stream, index) => (
                <motion.div
                  key={stream.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">{stream.name}</CardTitle>
                          <CardDescription className="text-lg mb-4">{stream.description}</CardDescription>
                          <Badge className={`${getConfidenceColor(stream.confidence)} text-sm px-3 py-1`}>
                            {getConfidenceText(stream.confidence)} - {Math.round(stream.confidence * 100)}%
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-blue-600">
                            {Math.round(stream.confidence * 100)}%
                          </div>
                          <div className="text-sm text-gray-500">Match Score</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Brain className="h-5 w-5 text-purple-600" />
                          Why This Stream Fits You
                        </h4>
                        <p className="text-gray-700">{stream.reasoning}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-green-600" />
                            Subjects
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {stream.subjects.map((subject, idx) => (
                              <Badge key={idx} variant="outline">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-600" />
                            Career Paths
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {stream.careerPaths.map((path, idx) => (
                              <Badge key={idx} variant="secondary">
                                {path}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-green-600">Pros</h4>
                          <ul className="space-y-1">
                            {stream.pros.map((pro, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-orange-600">Considerations</h4>
                          <ul className="space-y-1">
                            {stream.cons.map((con, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <div className="w-4 h-4 rounded-full bg-orange-200 mt-0.5 flex-shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="colleges">
            <div className="space-y-6">
              {collegeRecommendations.map((college, index) => (
                <motion.div
                  key={college.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">{college.name}</CardTitle>
                          <div className="flex items-center gap-4 text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {college.location}, {college.state}
                            </div>
                            <Badge variant="outline">{college.type}</Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              {college.rating}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {college.cutoff}%
                          </div>
                          <div className="text-sm text-gray-500">Cutoff</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Heart className="h-5 w-5 text-pink-600" />
                          Why This College Fits You
                        </h4>
                        <p className="text-gray-700">{college.whyItFits}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-purple-600" />
                            Available Courses
                          </h4>
                          <div className="space-y-1">
                            {college.courses.map((course, idx) => (
                              <div key={idx} className="text-sm text-gray-700">
                                • {course}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            Quick Stats
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Rating:</span>
                              <span className="font-medium">{college.rating}/5</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Cutoff:</span>
                              <span className="font-medium">{college.cutoff}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Type:</span>
                              <span className="font-medium">{college.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3 text-green-600">Advantages</h4>
                          <ul className="space-y-1">
                            {college.pros.map((pro, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3 text-orange-600">Considerations</h4>
                          <ul className="space-y-1">
                            {college.cons.map((con, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <div className="w-4 h-4 rounded-full bg-orange-200 mt-0.5 flex-shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button asChild>
                          <a href={college.website} target="_blank" rel="noopener noreferrer">
                            Visit Website
                            <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="outline">
                          Save to Favorites
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Make Your Decision?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                These recommendations are based on comprehensive analysis of your academic profile, 
                aptitude, and interests. Take your time to consider each option carefully.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Download Full Report
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100">
                  Schedule Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Recommendations;