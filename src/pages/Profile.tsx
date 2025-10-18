import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  BookOpen, 
  Brain, 
  MessageCircle, 
  Target, 
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Mail,
  Phone
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data - in real implementation, this would come from the database
  const userProfile = {
    personalInfo: {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "+91 98765 43210",
      location: "New Delhi, India",
      dateOfBirth: "2006-03-15",
      currentClass: 10,
      board: "CBSE"
    },
    academicPerformance: {
      overallPercentage: 88.5,
      subjects: [
        { name: "Mathematics", percentage: 92, grade: "A1" },
        { name: "Science", percentage: 89, grade: "A1" },
        { name: "English", percentage: 85, grade: "A2" },
        { name: "Social Studies", percentage: 88, grade: "A1" }
      ]
    },
    aptitudeResults: {
      logical: {
        score: 7,
        total: 8,
        percentage: 87.5,
        categoryScores: {
          verbal: 2,
          numerical: 3,
          spatial: 2,
          logical: 3
        }
      },
      interest: {
        score: 3.2,
        total: 4.0,
        categoryScores: {
          analytical: 4,
          quantitative: 4,
          creative: 2,
          social: 3,
          technical: 4,
          independent: 3,
          academic: 4,
          leadership: 2
        }
      }
    },
    emotionalAnalysis: {
      overallTone: "positive",
      stressLevel: 2,
      confidence: 8,
      motivation: 9
    },
    recommendations: {
      topStream: "Science (PCM)",
      topCollege: "Indian Institute of Technology Delhi",
      matchScore: 95
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A1": return "bg-green-500";
      case "A2": return "bg-blue-500";
      case "B1": return "bg-yellow-500";
      case "B2": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getConfidenceColor = (level: number) => {
    if (level >= 8) return "text-green-600";
    if (level >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Profile
              </h1>
              <p className="text-xl text-gray-600">
                Your complete academic and career guidance profile
              </p>
            </div>
            <Button onClick={() => navigate("/recommendations")}>
              View Recommendations
            </Button>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Academic
            </TabsTrigger>
            <TabsTrigger value="aptitude" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Aptitude
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{userProfile.personalInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{userProfile.personalInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{userProfile.personalInfo.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Class {userProfile.personalInfo.currentClass} • {userProfile.personalInfo.board}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Performance</span>
                      <Badge className="bg-green-500">
                        {userProfile.academicPerformance.overallPercentage}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Aptitude Score</span>
                      <Badge className="bg-blue-500">
                        {userProfile.aptitudeResults.logical.percentage}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Confidence Level</span>
                      <Badge className="bg-purple-500">
                        {userProfile.emotionalAnalysis.confidence}/10
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Top Match</span>
                      <Badge className="bg-orange-500">
                        {userProfile.recommendations.matchScore}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommended Path
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Stream Recommendation</h4>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{userProfile.recommendations.topStream}</span>
                        <Badge className="bg-green-500">Top Match</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">College Recommendation</h4>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{userProfile.recommendations.topCollege}</span>
                        <Badge className="bg-green-500">Top Match</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="academic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Academic Performance
                </CardTitle>
                <CardDescription>
                  Your Class 10 academic results and subject-wise performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">Overall Percentage</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {userProfile.academicPerformance.overallPercentage}%
                    </span>
                  </div>
                  <Progress value={userProfile.academicPerformance.overallPercentage} className="h-3" />
                </div>

                <div className="space-y-4">
                  {userProfile.academicPerformance.subjects.map((subject, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={getGradeColor(subject.grade)}>
                          {subject.grade}
                        </Badge>
                        <span className="font-medium">{subject.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{subject.percentage}%</span>
                        <Progress value={subject.percentage} className="w-20 h-2" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="aptitude" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Logical Reasoning Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {userProfile.aptitudeResults.logical.score}/{userProfile.aptitudeResults.logical.total}
                      </div>
                      <div className="text-sm text-gray-600">
                        {userProfile.aptitudeResults.logical.percentage}% Score
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Category Breakdown</h4>
                      {Object.entries(userProfile.aptitudeResults.logical.categoryScores).map(([category, score]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{category}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={(score / 3) * 100} className="w-16 h-2" />
                            <span className="text-sm text-gray-600">{score}/3</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Interest Profiling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {userProfile.aptitudeResults.interest.score}/4.0
                      </div>
                      <div className="text-sm text-gray-600">Average Interest Score</div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Interest Areas</h4>
                      {Object.entries(userProfile.aptitudeResults.interest.categoryScores).map(([category, score]) => (
                        <div key={category} className="flex justify-between items-center">
                          <span className="text-sm capitalize">{category}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={(score / 4) * 100} className="w-16 h-2" />
                            <span className="text-sm text-gray-600">{score.toFixed(1)}/4</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Emotional Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Tone</span>
                      <Badge variant={userProfile.emotionalAnalysis.overallTone === 'positive' ? 'default' : 'secondary'}>
                        {userProfile.emotionalAnalysis.overallTone}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Stress Level</span>
                      <span className="text-sm text-gray-600">
                        {userProfile.emotionalAnalysis.stressLevel}/5
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Confidence</span>
                      <span className={`text-sm font-medium ${getConfidenceColor(userProfile.emotionalAnalysis.confidence)}`}>
                        {userProfile.emotionalAnalysis.confidence}/10
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Motivation</span>
                      <span className={`text-sm font-medium ${getConfidenceColor(userProfile.emotionalAnalysis.motivation)}`}>
                        {userProfile.emotionalAnalysis.motivation}/10
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Strong analytical and problem-solving abilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>High interest in quantitative and technical fields</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Good communication and academic performance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Well-suited for science and engineering streams</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Moderate interest in leadership and social activities</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
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
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
