import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  MapPin, 
  Star, 
  ExternalLink, 
  BookOpen, 
  Users, 
  Calendar,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { aiService } from "@/services/aiService";

interface StreamRecommendation {
  id: string;
  name: string;
  description: string;
  subjects: string[];
  careerPaths: string[];
  confidenceScore: number;
  reasoning: string;
  difficultyLevel: number;
}

interface CollegeRecommendation {
  id: string;
  name: string;
  location: string;
  type: string;
  rating: number;
  cutoffPercentage: number;
  courses: string[];
  website: string;
  establishedYear: number;
  reasoning: string;
  confidenceScore: number;
}

const Recommendations = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [streamRecommendations, setStreamRecommendations] = useState<StreamRecommendation[]>([]);
  const [collegeRecommendations, setCollegeRecommendations] = useState<CollegeRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState<any>(null);

  useEffect(() => {
    generateRecommendations();
  }, []);

  const generateRecommendations = async () => {
    if (!user) return;

    try {
      // Get student data
      const { data: student } = await supabase
        .from("students")
        .select(`
          *,
          marks(*),
          aptitude_results(*),
          ai_conversations(*)
        `)
        .eq("user_id", user.id)
        .single();

      if (!student) return;

      setStudentProfile(student);

      // Prepare data for AI service
      const recommendationRequest = {
        studentProfile: {
          marks: student.marks || [],
          aptitudeResults: student.aptitude_results?.[0] || { logicalScore: 0, interestScore: 0 },
          conversationInsights: {
            messageCount: student.ai_conversations?.length || 0,
            averageResponseLength: 50 // Mock value
          }
        }
      };

      // Generate recommendations using AI service
      const { streams, colleges } = await aiService.generateRecommendations(recommendationRequest);

      setStreamRecommendations(streams);
      setCollegeRecommendations(colleges);

      // Save recommendations to database
      await saveRecommendations(streams, colleges, student.id);

    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveRecommendations = async (streams: StreamRecommendation[], colleges: CollegeRecommendation[], studentId: string) => {
    try {
      // Save stream recommendations
      const streamData = streams.map(stream => ({
        student_id: studentId,
        recommendation_type: "stream",
        stream_id: stream.id,
        confidence_score: stream.confidenceScore,
        reasoning: stream.reasoning
      }));

      // Save college recommendations
      const collegeData = colleges.map(college => ({
        student_id: studentId,
        recommendation_type: "college",
        college_id: college.id,
        confidence_score: college.confidenceScore,
        reasoning: college.reasoning
      }));

      await supabase.from("recommendations").insert([...streamData, ...collegeData]);
    } catch (error) {
      console.error("Error saving recommendations:", error);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceBadgeVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Your Recommendations</h2>
            <p className="text-gray-600">Our AI is analyzing your profile to provide personalized guidance...</p>
          </div>
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
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Personalized Recommendations
            </h1>
            <p className="text-xl text-gray-600">
              Based on your academic profile, aptitude tests, and our conversation
            </p>
          </div>

          {/* Profile Summary */}
          {studentProfile && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Academic Profile</CardTitle>
                <CardDescription>Summary of your academic performance and test results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Academic Performance</h4>
                    <div className="space-y-2">
                      {studentProfile.marks?.slice(0, 3).map((mark: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-sm">{mark.subject}</span>
                          <Badge variant="outline">{mark.percentage}%</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Aptitude Scores</h4>
                    <div className="space-y-2">
                      {studentProfile.aptitude_results?.[0] && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm">Logical Reasoning</span>
                            <Badge variant="outline">{studentProfile.aptitude_results[0].logical_score}%</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Interest Profiling</span>
                            <Badge variant="outline">{studentProfile.aptitude_results[0].interest_score}%</Badge>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Conversation Insights</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Messages</span>
                        <Badge variant="outline">{studentProfile.ai_conversations?.length || 0}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Engagement</span>
                        <Badge variant="outline">High</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations Tabs */}
          <Tabs defaultValue="streams" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="streams">Stream Recommendations</TabsTrigger>
              <TabsTrigger value="colleges">College Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="streams" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Recommended Streams for Class 11</h2>
                <p className="text-gray-600">Based on your academic strengths and interests</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {streamRecommendations.map((stream, index) => (
                  <motion.div
                    key={stream.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-xl">{stream.name}</CardTitle>
                          <Badge variant={getConfidenceBadgeVariant(stream.confidenceScore)}>
                            {stream.confidenceScore}% Match
                          </Badge>
                        </div>
                        <CardDescription>{stream.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Subjects</h4>
                          <div className="flex flex-wrap gap-2">
                            {stream.subjects.map((subject, idx) => (
                              <Badge key={idx} variant="outline">{subject}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Career Paths</h4>
                          <div className="flex flex-wrap gap-2">
                            {stream.careerPaths.map((career, idx) => (
                              <Badge key={idx} variant="secondary">{career}</Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Why This Fits You</h4>
                          <p className="text-sm text-gray-600">{stream.reasoning}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">Difficulty: {stream.difficultyLevel}/10</span>
                          </div>
                          <Button size="sm" variant="outline">
                            Learn More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="colleges" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Recommended Colleges & Courses</h2>
                <p className="text-gray-600">Institutions that match your academic profile</p>
              </div>

              <div className="space-y-6">
                {collegeRecommendations.map((college, index) => (
                  <motion.div
                    key={college.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{college.name}</h3>
                            <div className="flex items-center space-x-4 text-gray-600">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{college.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Est. {college.establishedYear}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4" />
                                <span>{college.rating}/5</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant={getConfidenceBadgeVariant(college.confidenceScore)}>
                            {college.confidenceScore}% Match
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-2">Available Courses</h4>
                            <div className="flex flex-wrap gap-2">
                              {college.courses.map((course, idx) => (
                                <Badge key={idx} variant="outline">{course}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Admission Requirements</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm">Cutoff Percentage</span>
                                <Badge variant="outline">{college.cutoffPercentage}%</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm">Type</span>
                                <Badge variant="secondary">{college.type}</Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Why This College Fits You</h4>
                          <p className="text-sm text-gray-600 mb-4">{college.reasoning}</p>
                          
                          <div className="flex space-x-4">
                            <Button size="sm" variant="outline" asChild>
                              <a href={college.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Visit Website
                              </a>
                            </Button>
                            <Button size="sm" variant="outline">
                              <BookOpen className="h-4 w-4 mr-2" />
                              View Courses
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="text-center mt-12 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/ai-coach")}
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Back to AI Coach
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Download className="mr-2 h-5 w-5" />
                Download Report
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Save your recommendations and share them with your parents and teachers
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Recommendations;