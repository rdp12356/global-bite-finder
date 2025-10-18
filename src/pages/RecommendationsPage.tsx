import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  CheckCircle, 
  Star, 
  MapPin, 
  ExternalLink,
  GraduationCap,
  BookOpen,
  Target,
  Download,
  Share2
} from 'lucide-react'

interface StreamRecommendation {
  id: string
  name: string
  description: string
  confidence: number
  reasoning: string
  subjects: string[]
  careerPaths: string[]
}

interface CollegeRecommendation {
  id: string
  name: string
  location: string
  type: string
  rating: number
  cutoffMarks: number
  website: string
  confidence: number
  reasoning: string
  courses: string[]
}

const mockStreamRecommendations: StreamRecommendation[] = [
  {
    id: '1',
    name: 'Science (PCM)',
    description: 'Physics, Chemistry, Mathematics stream',
    confidence: 0.92,
    reasoning: 'Your strong performance in Mathematics and Physics, combined with your analytical thinking skills and interest in problem-solving, makes this the ideal stream for you.',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'English'],
    careerPaths: ['Engineering', 'Research', 'Data Science', 'Technology']
  },
  {
    id: '2',
    name: 'Computer Science',
    description: 'Computer Science with Mathematics and Physics',
    confidence: 0.88,
    reasoning: 'Your aptitude test results show strong logical reasoning abilities and interest in technology, making you well-suited for computer science.',
    subjects: ['Computer Science', 'Mathematics', 'Physics', 'English'],
    careerPaths: ['Software Development', 'AI/ML', 'Cybersecurity', 'Data Analysis']
  },
  {
    id: '3',
    name: 'Science (PCB)',
    description: 'Physics, Chemistry, Biology stream',
    confidence: 0.75,
    reasoning: 'Your good performance in Biology and interest in helping others suggests potential in medical or life sciences fields.',
    subjects: ['Physics', 'Chemistry', 'Biology', 'English'],
    careerPaths: ['Medicine', 'Biotechnology', 'Research', 'Healthcare']
  }
]

const mockCollegeRecommendations: CollegeRecommendation[] = [
  {
    id: '1',
    name: 'Indian Institute of Technology Delhi',
    location: 'New Delhi',
    type: 'Central',
    rating: 4.8,
    cutoffMarks: 95,
    website: 'https://www.iitd.ac.in',
    confidence: 0.95,
    reasoning: 'Based on your academic performance and aptitude scores, IIT Delhi would be an excellent choice for pursuing engineering or computer science.',
    courses: ['Computer Science Engineering', 'Mechanical Engineering', 'Electrical Engineering']
  },
  {
    id: '2',
    name: 'Delhi University',
    location: 'New Delhi',
    type: 'Central',
    rating: 4.5,
    cutoffMarks: 85,
    website: 'https://www.du.ac.in',
    confidence: 0.88,
    reasoning: 'DU offers excellent programs in science and computer science with a strong academic reputation and diverse opportunities.',
    courses: ['B.Sc Computer Science', 'B.Sc Physics', 'B.Sc Mathematics']
  },
  {
    id: '3',
    name: 'St. Stephen\'s College',
    location: 'New Delhi',
    type: 'Central',
    rating: 4.7,
    cutoffMarks: 90,
    website: 'https://www.ststephens.edu',
    confidence: 0.82,
    reasoning: 'St. Stephen\'s provides a rigorous academic environment that would challenge and develop your analytical skills further.',
    courses: ['B.Sc Physics', 'B.Sc Mathematics', 'B.Sc Computer Science']
  },
  {
    id: '4',
    name: 'Indian Institute of Science Bangalore',
    location: 'Bangalore',
    type: 'Central',
    rating: 4.9,
    cutoffMarks: 98,
    website: 'https://www.iisc.ac.in',
    confidence: 0.90,
    reasoning: 'IISc Bangalore is perfect for research-oriented students with strong analytical abilities like yourself.',
    courses: ['B.Sc Research', 'Integrated Ph.D', 'M.Tech']
  }
]

export default function RecommendationsPage() {
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(true)
  const [streamRecommendations, setStreamRecommendations] = useState<StreamRecommendation[]>([])
  const [collegeRecommendations, setCollegeRecommendations] = useState<CollegeRecommendation[]>([])

  useEffect(() => {
    // Simulate AI processing time
    const timer = setTimeout(() => {
      setStreamRecommendations(mockStreamRecommendations)
      setCollegeRecommendations(mockCollegeRecommendations)
      setIsGenerating(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleDownloadReport = () => {
    // Generate and download a PDF report
    console.log('Downloading report...')
  }

  const handleShareResults = () => {
    // Share results functionality
    console.log('Sharing results...')
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => navigate('/ai-chat')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chat
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Generating Recommendations</h1>
                  <p className="text-muted-foreground">Step 4 of 4 - AI is analyzing your profile</p>
                </div>
              </div>
              <Badge variant="outline">Step 4 of 4</Badge>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-12 w-12 text-blue-600 animate-pulse" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Analyzing Your Profile</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our AI is processing your marks, aptitude test results, and conversation to generate personalized recommendations...
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Processing</span>
                  <span className="text-sm text-muted-foreground">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Your Recommendations</h1>
                <p className="text-muted-foreground">Step 4 of 4 - Personalized academic guidance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleDownloadReport}>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" size="sm" onClick={handleShareResults}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Badge variant="outline">Step 4 of 4</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
            <p className="text-xl text-muted-foreground">
              Based on your profile, we've generated personalized recommendations for your academic journey.
            </p>
          </motion.div>

          {/* Recommendations Tabs */}
          <Tabs defaultValue="streams" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="streams">Stream Recommendations</TabsTrigger>
              <TabsTrigger value="colleges">College Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="streams" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Recommended Streams for Class 11</h3>
                <p className="text-muted-foreground">
                  Based on your academic performance, aptitude, and interests
                </p>
              </div>

              <div className="grid gap-6">
                {streamRecommendations.map((stream, index) => (
                  <motion.div
                    key={stream.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{stream.name}</CardTitle>
                            <CardDescription className="text-base mb-4">
                              {stream.description}
                            </CardDescription>
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="flex items-center space-x-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium">
                                  {Math.round(stream.confidence * 100)}% Match
                                </span>
                              </div>
                              <Badge variant="secondary">
                                {stream.subjects.length} Subjects
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              {Math.round(stream.confidence * 100)}%
                            </div>
                            <div className="text-sm text-muted-foreground">Confidence</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Why this stream fits you:</h4>
                          <p className="text-sm text-muted-foreground">{stream.reasoning}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Subjects you'll study:</h4>
                          <div className="flex flex-wrap gap-2">
                            {stream.subjects.map((subject) => (
                              <Badge key={subject} variant="outline">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Potential career paths:</h4>
                          <div className="flex flex-wrap gap-2">
                            {stream.careerPaths.map((career) => (
                              <Badge key={career} variant="secondary">
                                {career}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="colleges" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Recommended Colleges for Class 12</h3>
                <p className="text-muted-foreground">
                  Top institutions that match your academic profile and goals
                </p>
              </div>

              <div className="grid gap-6">
                {collegeRecommendations.map((college, index) => (
                  <motion.div
                    key={college.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{college.name}</CardTitle>
                            <div className="flex items-center space-x-4 mb-4">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-muted-foreground">{college.location}</span>
                              </div>
                              <Badge variant="outline">{college.type}</Badge>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm font-medium">{college.rating}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-sm">
                                <span className="text-muted-foreground">Cutoff: </span>
                                <span className="font-medium">{college.cutoffMarks}%</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground">Match: </span>
                                <span className="font-medium text-green-600">
                                  {Math.round(college.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={college.website} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Visit Website
                            </a>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Why this college is recommended:</h4>
                          <p className="text-sm text-muted-foreground">{college.reasoning}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Available courses:</h4>
                          <div className="flex flex-wrap gap-2">
                            {college.courses.map((course) => (
                              <Badge key={course} variant="outline">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Next Steps
                </CardTitle>
                <CardDescription>
                  Here's what you should do next to pursue your recommended path
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Research Further</h4>
                    <p className="text-sm text-muted-foreground">
                      Explore the recommended streams and colleges in detail
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Apply Early</h4>
                    <p className="text-sm text-muted-foreground">
                      Start preparing applications for your preferred colleges
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold mb-2">Stay Focused</h4>
                    <p className="text-sm text-muted-foreground">
                      Work hard to meet the cutoff requirements for your target colleges
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center space-x-4 mt-8"
          >
            <Button size="lg" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button size="lg" variant="outline" onClick={handleDownloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Full Report
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}