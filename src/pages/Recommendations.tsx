import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  GraduationCap, 
  MapPin, 
  Star, 
  ExternalLink, 
  CheckCircle, 
  ArrowRight, 
  Brain, 
  Target,
  BookOpen,
  TrendingUp,
  Users,
  Award,
  Download,
  Share2,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { RecommendationService, type RecommendationData } from "@/services/recommendationService";

interface StreamRecommendation {
  id: string;
  name: string;
  description: string;
  suitability: number;
  reasons: string[];
  subjects: string[];
  careerPaths: string[];
  icon: string;
}

interface CollegeRecommendation {
  id: string;
  name: string;
  location: string;
  rating: number;
  cutoff: string;
  course: string;
  description: string;
  whyItFits: string;
  officialLink: string;
  image: string;
  tags: string[];
}

interface RecommendationData {
  streamRecommendations: StreamRecommendation[];
  collegeRecommendations: CollegeRecommendation[];
  overallInsights: {
    strengths: string[];
    areasForImprovement: string[];
    personalityTraits: string[];
    learningStyle: string;
  };
}

const Recommendations = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [recommendationData, setRecommendationData] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);

  useEffect(() => {
    // Load all student data
    const marksData = localStorage.getItem('marksData');
    const aptitudeData = localStorage.getItem('aptitudeResults');
    const conversationData = localStorage.getItem('conversationData');

    if (marksData && aptitudeData) {
      generateRecommendations(JSON.parse(marksData), JSON.parse(aptitudeData), conversationData ? JSON.parse(conversationData) : null);
    }
  }, []);

  const generateRecommendations = async (marks: any, aptitude: any[], conversation: any) => {
    try {
      // Generate recommendations using the service
      const recommendations = await RecommendationService.generateRecommendations(marks, aptitude, conversation);
      
      setRecommendationData(recommendations);
      setLoading(false);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setLoading(false);
    }
  };


  const getSuitabilityColor = (suitability: number) => {
    if (suitability >= 80) return 'text-green-600 bg-green-100';
    if (suitability >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSuitabilityLabel = (suitability: number) => {
    if (suitability >= 80) return 'Highly Recommended';
    if (suitability >= 60) return 'Good Match';
    return 'Consider Carefully';
  };

  const handleSaveRecommendations = async () => {
    if (!user || !recommendationData) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in to save recommendations.',
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const result = await RecommendationService.saveRecommendations(user.id, recommendationData);
      
      if (result.success) {
        toast({
          title: 'Recommendations saved successfully!',
          description: 'Your personalized recommendations have been saved to your profile.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error saving recommendations',
          description: 'Please try again or contact support.',
        });
      }
    } catch (error) {
      console.error('Error saving recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving recommendations',
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-lg text-gray-600">Generating your personalized recommendations...</p>
        </div>
      </div>
    );
  }

  if (!recommendationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-600">Unable to generate recommendations. Please try again.</p>
          <Button onClick={() => navigate('/marks')}>Start Over</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Your Personalized Recommendations
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Based on your academic performance, aptitude tests, and our conversation, 
              here are your tailored recommendations for Class 11 stream and future college options.
            </p>
          </div>

          {/* Stream Recommendations */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Recommended Streams for Class 11
              </h2>
              <p className="text-lg text-gray-600">
                Choose the stream that best aligns with your strengths and interests
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendationData.streamRecommendations.map((stream) => (
                <motion.div
                  key={stream.id}
                  whileHover={{ y: -5 }}
                  className="cursor-pointer"
                  onClick={() => setSelectedStream(stream.id)}
                >
                  <Card className={`h-full transition-all ${
                    selectedStream === stream.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-lg'
                  }`}>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-4xl">{stream.icon}</span>
                        <Badge className={getSuitabilityColor(stream.suitability)}>
                          {getSuitabilityLabel(stream.suitability)}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{stream.name}</CardTitle>
                      <CardDescription>{stream.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Suitability</span>
                          <span>{stream.suitability.toFixed(0)}%</span>
                        </div>
                        <Progress value={stream.suitability} className="h-2" />
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Key Subjects:</h4>
                        <div className="flex flex-wrap gap-1">
                          {stream.subjects.map((subject) => (
                            <Badge key={subject} variant="outline" className="text-xs">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Career Paths:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {stream.careerPaths.map((path) => (
                            <li key={path}>• {path}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* College Recommendations */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Recommended Colleges & Courses
              </h2>
              <p className="text-lg text-gray-600">
                Top institutions that match your profile and aspirations
              </p>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="engineering">Engineering</TabsTrigger>
                <TabsTrigger value="commerce">Commerce</TabsTrigger>
                <TabsTrigger value="arts">Arts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendationData.collegeRecommendations.map((college) => (
                    <motion.div
                      key={college.id}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="h-full">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{college.name}</CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{college.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">{college.rating}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-medium">{college.course}</h4>
                            <p className="text-sm text-gray-600">{college.description}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Cutoff:</span>
                              <span className="font-medium">{college.cutoff}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Rating:</span>
                              <span className="font-medium">{college.rating}/5</span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Why it fits you:</h4>
                            <p className="text-sm text-gray-600">{college.whyItFits}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {college.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Visit Website
                            </Button>
                            <Button size="sm" variant="outline">
                              Save
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>

          {/* Overall Insights */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your Academic Profile
              </h2>
              <p className="text-lg text-gray-600">
                Insights about your strengths and areas for growth
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {recommendationData.overallInsights.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Areas for Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {recommendationData.overallInsights.areasForImprovement.map((area, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Personality Traits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {recommendationData.overallInsights.personalityTraits.map((trait, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                    Learning Style
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {recommendationData.overallInsights.learningStyle}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-6"
              onClick={handleSaveRecommendations}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Save Recommendations
                </>
              )}
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6">
              <Share2 className="h-5 w-5 mr-2" />
              Share with Parents
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6"
              onClick={() => navigate('/')}
            >
              Start New Assessment
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Recommendations;