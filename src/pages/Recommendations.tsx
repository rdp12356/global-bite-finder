import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  GraduationCap, 
  MapPin, 
  Star, 
  ExternalLink, 
  CheckCircle, 
  ArrowRight,
  BookOpen,
  Users,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StreamRecommendation {
  id: string;
  name: string;
  type: 'science' | 'commerce' | 'arts' | 'humanities';
  confidence: number;
  reasoning: string;
  subjects: string[];
  careerPaths: string[];
  matchScore: number;
}

interface CollegeRecommendation {
  id: string;
  name: string;
  type: string;
  location: string;
  rating: number;
  website: string;
  description: string;
  courses: string[];
  cutoff: number;
  fees: number;
  matchScore: number;
  reasoning: string;
}

const Recommendations = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [streamRecommendations, setStreamRecommendations] = useState<StreamRecommendation[]>([]);
  const [collegeRecommendations, setCollegeRecommendations] = useState<CollegeRecommendation[]>([]);

  // Mock data - in real implementation, this would come from AI analysis
  const mockStreamRecommendations: StreamRecommendation[] = [
    {
      id: '1',
      name: 'Science (PCM)',
      type: 'science',
      confidence: 92,
      reasoning: 'Your strong performance in Mathematics (92%) and Science subjects, combined with high logical reasoning scores, makes you an excellent fit for Science stream. Your analytical thinking and problem-solving abilities align perfectly with PCM subjects.',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'English', 'Computer Science'],
      careerPaths: ['Engineering', 'Data Science', 'Research', 'Architecture', 'Medicine'],
      matchScore: 92
    },
    {
      id: '2',
      name: 'Science (PCB)',
      type: 'science',
      confidence: 78,
      reasoning: 'Your interest in understanding how things work and good performance in Science subjects suggests PCB could be a good alternative. However, your mathematical strength makes PCM more suitable.',
      subjects: ['Physics', 'Chemistry', 'Biology', 'English', 'Physical Education'],
      careerPaths: ['Medicine', 'Dentistry', 'Pharmacy', 'Biotechnology', 'Research'],
      matchScore: 78
    },
    {
      id: '3',
      name: 'Commerce',
      type: 'commerce',
      confidence: 65,
      reasoning: 'While you have good analytical skills, your interest profile shows limited enthusiasm for business and commerce-related activities. Consider this if you have specific interest in economics or business.',
      subjects: ['Accountancy', 'Business Studies', 'Economics', 'English', 'Mathematics'],
      careerPaths: ['Chartered Accountancy', 'Business Management', 'Banking', 'Finance'],
      matchScore: 65
    }
  ];

  const mockCollegeRecommendations: CollegeRecommendation[] = [
    {
      id: '1',
      name: 'Indian Institute of Technology Delhi',
      type: 'Institute',
      location: 'New Delhi, Delhi',
      rating: 4.8,
      website: 'https://www.iitd.ac.in',
      description: 'Premier engineering institute with world-class facilities and faculty. Excellent placement record and research opportunities.',
      courses: ['Computer Science Engineering', 'Mechanical Engineering', 'Electrical Engineering'],
      cutoff: 98.5,
      fees: 250000,
      matchScore: 95,
      reasoning: 'Your exceptional academic performance and strong logical reasoning make you a competitive candidate for IIT Delhi. Your analytical skills align perfectly with their rigorous curriculum.'
    },
    {
      id: '2',
      name: 'Delhi University',
      type: 'University',
      location: 'New Delhi, Delhi',
      rating: 4.5,
      website: 'https://www.du.ac.in',
      description: 'One of the largest universities in India with diverse course offerings and vibrant campus life.',
      courses: ['B.Sc (Hons) Physics', 'B.Sc (Hons) Mathematics', 'B.Sc (Hons) Computer Science'],
      cutoff: 85.0,
      fees: 45000,
      matchScore: 88,
      reasoning: 'Your strong academic foundation and interest in science subjects make Delhi University an excellent choice. The diverse course offerings allow for exploration of different fields.'
    },
    {
      id: '3',
      name: 'St. Stephen\'s College',
      type: 'College',
      location: 'New Delhi, Delhi',
      rating: 4.7,
      website: 'https://www.ststephens.edu',
      description: 'Renowned liberal arts college with excellent faculty and strong academic reputation.',
      courses: ['B.A (Hons) English', 'B.Sc (Hons) Physics', 'B.Sc (Hons) Mathematics'],
      cutoff: 90.0,
      fees: 35000,
      matchScore: 82,
      reasoning: 'While primarily known for liberal arts, St. Stephen\'s offers excellent science programs. Your well-rounded profile makes you a good fit for their holistic education approach.'
    }
  ];

  useEffect(() => {
    // Simulate AI processing time
    const timer = setTimeout(() => {
      setStreamRecommendations(mockStreamRecommendations);
      setCollegeRecommendations(mockCollegeRecommendations);
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Analyzing Your Profile
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Our AI is processing your academic data, aptitude results, and conversation insights to generate personalized recommendations.
            </p>
            <div className="max-w-md mx-auto">
              <Progress value={75} className="mb-4" />
              <p className="text-sm text-gray-500">Almost there...</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Personalized Recommendations
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Based on your academic performance, aptitude tests, and conversation with our AI coach, here are your tailored recommendations.
          </p>
        </motion.div>

        <Tabs defaultValue="streams" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="streams" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Stream Recommendations
            </TabsTrigger>
            <TabsTrigger value="colleges" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              College Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="streams" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Recommended Streams for Class 11
              </h2>
              <p className="text-gray-600">
                Choose the stream that best matches your interests and academic strengths
              </p>
            </div>

            <div className="space-y-6">
              {streamRecommendations.map((stream, index) => (
                <motion.div
                  key={stream.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`${index === 0 ? 'ring-2 ring-blue-500' : ''} hover:shadow-lg transition-shadow`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {stream.name}
                            {index === 0 && <Badge className="bg-green-500">Top Match</Badge>}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {stream.reasoning}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {stream.matchScore}%
                          </div>
                          <div className="text-sm text-gray-500">Match Score</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Subjects
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {stream.subjects.map((subject, idx) => (
                              <Badge key={idx} variant="secondary">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Career Paths
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {stream.careerPaths.map((path, idx) => (
                              <Badge key={idx} variant="outline">
                                {path}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Confidence Level</span>
                          <span className="text-sm text-gray-500">{stream.confidence}%</span>
                        </div>
                        <Progress value={stream.confidence} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="colleges" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Recommended Colleges for Class 12
              </h2>
              <p className="text-gray-600">
                Top colleges that match your academic profile and career aspirations
              </p>
            </div>

            <div className="space-y-6">
              {collegeRecommendations.map((college, index) => (
                <motion.div
                  key={college.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`${index === 0 ? 'ring-2 ring-blue-500' : ''} hover:shadow-lg transition-shadow`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {college.name}
                            {index === 0 && <Badge className="bg-green-500">Top Match</Badge>}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {college.description}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            {college.matchScore}%
                          </div>
                          <div className="text-sm text-gray-500">Match Score</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{college.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm text-gray-600">{college.rating}/5.0</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">Cutoff: {college.cutoff}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">Fees: ₹{college.fees.toLocaleString()}/year</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Available Courses</h4>
                          <div className="space-y-1">
                            {college.courses.map((course, idx) => (
                              <div key={idx} className="text-sm text-gray-600">
                                • {course}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Why This College Fits You:</h4>
                        <p className="text-sm text-gray-700">{college.reasoning}</p>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={college.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit Website
                          </a>
                        </Button>
                        <Button size="sm">
                          Apply Now
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
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8"
        >
          <Button
            size="lg"
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2"
          >
            View My Profile
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Recommendations;
