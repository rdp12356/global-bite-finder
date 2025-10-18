import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  GraduationCap, 
  Building, 
  Star, 
  MapPin, 
  ExternalLink, 
  CheckCircle,
  TrendingUp,
  Users,
  Award
} from "lucide-react";

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
  type: string;
  location: string;
  rating: number;
  cutoff: number;
  website: string;
  description: string;
  courses: string[];
  feeRange: string;
  pros: string[];
  cons: string[];
}

const Recommendations = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(true);
  const [streamRecommendations, setStreamRecommendations] = useState<StreamRecommendation[]>([]);
  const [collegeRecommendations, setCollegeRecommendations] = useState<CollegeRecommendation[]>([]);

  useEffect(() => {
    // Simulate AI processing time
    const timer = setTimeout(() => {
      generateRecommendations();
      setIsGenerating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const generateRecommendations = () => {
    // Mock data - in real app, this would come from AI analysis
    setStreamRecommendations([
      {
        id: "1",
        name: "Science (PCM)",
        description: "Physics, Chemistry, Mathematics - Perfect for engineering and technology careers",
        confidence: 92,
        reasoning: "Your strong performance in Mathematics (95%) and Physics (88%) combined with excellent logical reasoning skills (87%) makes you an ideal candidate for science stream. Your aptitude test shows strong analytical thinking and problem-solving abilities.",
        subjects: ["Mathematics", "Physics", "Chemistry", "English"],
        careerPaths: ["Engineering", "Data Science", "Research", "Technology"],
        pros: [
          "Opens doors to top engineering colleges",
          "Strong foundation for technology careers",
          "High earning potential",
          "Diverse career options"
        ],
        cons: [
          "Highly competitive environment",
          "Requires consistent hard work",
          "Mathematics-intensive curriculum"
        ]
      },
      {
        id: "2",
        name: "Science (PCB)",
        description: "Physics, Chemistry, Biology - Ideal for medical and life sciences",
        confidence: 78,
        reasoning: "Your good performance in Biology (82%) and Chemistry (85%) along with interest in helping others suggests you might excel in medical or life sciences fields.",
        subjects: ["Physics", "Chemistry", "Biology", "English"],
        careerPaths: ["Medicine", "Biotechnology", "Pharmacy", "Research"],
        pros: [
          "Pathway to medical careers",
          "Growing field with opportunities",
          "Chance to help others",
          "Respected profession"
        ],
        cons: [
          "Very competitive entrance exams",
          "Long duration of study",
          "High stress levels"
        ]
      }
    ]);

    setCollegeRecommendations([
      {
        id: "1",
        name: "Indian Institute of Technology Delhi",
        type: "Institute",
        location: "New Delhi, Delhi",
        rating: 4.8,
        cutoff: 98.5,
        website: "https://www.iitd.ac.in",
        description: "Premier engineering institute with world-class facilities and faculty",
        courses: ["Computer Science Engineering", "Mechanical Engineering", "Electrical Engineering"],
        feeRange: "₹2-3 Lakhs/year",
        pros: [
          "Top-ranked engineering institute",
          "Excellent placement record",
          "World-class faculty",
          "Strong alumni network"
        ],
        cons: [
          "Very high cutoff marks",
          "Intense academic pressure",
          "Competitive environment"
        ]
      },
      {
        id: "2",
        name: "Delhi University",
        type: "University",
        location: "New Delhi, Delhi",
        rating: 4.2,
        cutoff: 92.0,
        website: "https://www.du.ac.in",
        description: "Renowned university with diverse course offerings and excellent faculty",
        courses: ["B.Sc. Physics (Hons)", "B.Sc. Mathematics (Hons)", "B.Sc. Chemistry (Hons)"],
        feeRange: "₹15,000-50,000/year",
        pros: [
          "Affordable fees",
          "Diverse course options",
          "Good faculty",
          "Central location"
        ],
        cons: [
          "Large class sizes",
          "Limited hostel facilities",
          "Competitive admission"
        ]
      },
      {
        id: "3",
        name: "St. Stephen's College",
        type: "College",
        location: "New Delhi, Delhi",
        rating: 4.5,
        cutoff: 95.0,
        website: "https://www.ststephens.edu",
        description: "Elite liberal arts college with excellent academic reputation",
        courses: ["B.A. Economics (Hons)", "B.Sc. Mathematics (Hons)", "B.A. English (Hons)"],
        feeRange: "₹25,000-65,000/year",
        pros: [
          "Excellent reputation",
          "Small class sizes",
          "Great faculty",
          "Strong alumni network"
        ],
        cons: [
          "High fees",
          "Very competitive admission",
          "Limited engineering courses"
        ]
      }
    ]);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 80) return "text-blue-600";
    if (confidence >= 70) return "text-yellow-600";
    return "text-orange-600";
  };

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100 text-green-800";
    if (confidence >= 80) return "bg-blue-100 text-blue-800";
    if (confidence >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-orange-100 text-orange-800";
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Generating Your Recommendations
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Our AI is analyzing your profile to provide personalized guidance...
          </p>
          <div className="w-64 mx-auto">
            <Progress value={75} className="h-2" />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-full">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Your Personalized Recommendations
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based on your academic performance, aptitude tests, and conversation, here are our AI-powered recommendations for your academic journey.
          </p>
        </motion.div>

        <Tabs defaultValue="streams" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="streams" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Stream Recommendations
            </TabsTrigger>
            <TabsTrigger value="colleges" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              College Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="streams" className="space-y-6">
            {streamRecommendations.map((stream, index) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl mb-2">{stream.name}</CardTitle>
                        <CardDescription className="text-lg">{stream.description}</CardDescription>
                      </div>
                      <Badge className={getConfidenceBadgeColor(stream.confidence)}>
                        {stream.confidence}% Match
                      </Badge>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium">Confidence Level:</span>
                        <span className={`font-bold ${getConfidenceColor(stream.confidence)}`}>
                          {stream.confidence}%
                        </span>
                      </div>
                      <Progress value={stream.confidence} className="h-2" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Why This Stream Fits You:</h4>
                      <p className="text-gray-700 leading-relaxed">{stream.reasoning}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Subjects You'll Study
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {stream.subjects.map((subject, idx) => (
                            <Badge key={idx} variant="outline" className="text-sm">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          Career Paths
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {stream.careerPaths.map((path, idx) => (
                            <Badge key={idx} variant="secondary" className="text-sm">
                              {path}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-3">Advantages:</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          {stream.pros.map((pro, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-700 mb-3">Considerations:</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          {stream.cons.map((con, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-orange-600 mt-1">•</span>
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
          </TabsContent>

          <TabsContent value="colleges" className="space-y-6">
            {collegeRecommendations.map((college, index) => (
              <motion.div
                key={college.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl mb-2">{college.name}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {college.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {college.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {college.rating}/5
                          </span>
                        </div>
                        <CardDescription className="text-base">{college.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">
                          Cutoff: {college.cutoff}%
                        </Badge>
                        <Badge variant="secondary">
                          {college.feeRange}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Available Courses:</h4>
                      <div className="flex flex-wrap gap-2">
                        {college.courses.map((course, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-3">Strengths:</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          {college.pros.map((pro, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-green-600 mt-1 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-700 mb-3">Considerations:</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          {college.cons.map((con, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-orange-600 mt-1">•</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Website:</span>{" "}
                        <a 
                          href={college.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1"
                        >
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <Button variant="outline" size="sm">
                        Save to Favorites
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between mt-12">
          <Button
            variant="outline"
            onClick={() => navigate("/chat")}
            className="px-8"
          >
            Back to AI Chat
          </Button>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="px-8"
            >
              Download Report
            </Button>
            <Button
              onClick={() => navigate("/")}
              className="px-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              Start New Assessment
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-center">Your Assessment Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-1">92%</div>
                <div className="text-sm text-gray-600">Best Stream Match</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-1">87%</div>
                <div className="text-sm text-gray-600">Logical Reasoning</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600 mb-1">85%</div>
                <div className="text-sm text-gray-600">Interest Alignment</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600 mb-1">3</div>
                <div className="text-sm text-gray-600">Top Colleges</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recommendations;
