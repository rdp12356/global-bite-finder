import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Settings,
  BookOpen,
  Brain,
  MessageCircle,
  Target
} from 'lucide-react'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    location: '',
    classLevel: '',
    careerGoals: '',
    learningStyle: '',
    interests: [] as string[]
  })

  const handleSave = () => {
    // Save profile data to database
    console.log('Saving profile:', profileData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      fullName: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      location: '',
      classLevel: '',
      careerGoals: '',
      learningStyle: '',
      interests: []
    })
    setIsEditing(false)
  }

  const mockProgress = {
    marksCompleted: true,
    aptitudeCompleted: true,
    chatCompleted: true,
    recommendationsGenerated: true
  }

  const mockStats = {
    totalTests: 2,
    averageScore: 87,
    timeSpent: '45 minutes',
    lastActivity: '2 hours ago'
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
                <h1 className="text-2xl font-bold">Profile</h1>
                <p className="text-muted-foreground">Manage your account and preferences</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback>
                      {profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
                        <p className="text-muted-foreground">{profileData.email}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary">Active User</Badge>
                          <Badge variant="outline">Premium</Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={profileData.email}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        disabled={!isEditing}
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <Label htmlFor="classLevel">Class Level</Label>
                      <Select
                        value={profileData.classLevel}
                        onValueChange={(value) => setProfileData(prev => ({ ...prev, classLevel: value }))}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="class-10">Class 10</SelectItem>
                          <SelectItem value="class-11">Class 11</SelectItem>
                          <SelectItem value="class-12">Class 12</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="careerGoals">Career Goals</Label>
                    <Input
                      id="careerGoals"
                      value={profileData.careerGoals}
                      onChange={(e) => setProfileData(prev => ({ ...prev, careerGoals: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Describe your career aspirations"
                    />
                  </div>
                  {isEditing && (
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="academic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Academic Profile
                  </CardTitle>
                  <CardDescription>
                    Your academic performance and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="learningStyle">Learning Style</Label>
                    <Select
                      value={profileData.learningStyle}
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, learningStyle: value }))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your learning style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visual">Visual</SelectItem>
                        <SelectItem value="auditory">Auditory</SelectItem>
                        <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                        <SelectItem value="reading">Reading/Writing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Interests</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {['Technology', 'Medicine', 'Engineering', 'Business', 'Arts', 'Science'].map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={interest}
                            checked={profileData.interests.includes(interest)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setProfileData(prev => ({
                                  ...prev,
                                  interests: [...prev.interests, interest]
                                }))
                              } else {
                                setProfileData(prev => ({
                                  ...prev,
                                  interests: prev.interests.filter(i => i !== interest)
                                }))
                              }
                            }}
                            disabled={!isEditing}
                            className="rounded"
                          />
                          <Label htmlFor={interest} className="text-sm">{interest}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Journey Progress
                    </CardTitle>
                    <CardDescription>
                      Your progress through the Zertainity platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Marks Input</span>
                        <Badge variant={mockProgress.marksCompleted ? "default" : "secondary"}>
                          {mockProgress.marksCompleted ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Aptitude Tests</span>
                        <Badge variant={mockProgress.aptitudeCompleted ? "default" : "secondary"}>
                          {mockProgress.aptitudeCompleted ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI Chat</span>
                        <Badge variant={mockProgress.chatCompleted ? "default" : "secondary"}>
                          {mockProgress.chatCompleted ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Recommendations</span>
                        <Badge variant={mockProgress.recommendationsGenerated ? "default" : "secondary"}>
                          {mockProgress.recommendationsGenerated ? "Generated" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Brain className="h-5 w-5 mr-2" />
                      Test Statistics
                    </CardTitle>
                    <CardDescription>
                      Your performance across all tests
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{mockStats.totalTests}</p>
                        <p className="text-sm text-muted-foreground">Tests Taken</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{mockStats.averageScore}%</p>
                        <p className="text-sm text-muted-foreground">Average Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{mockStats.timeSpent}</p>
                        <p className="text-sm text-muted-foreground">Time Spent</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-orange-600">{mockStats.lastActivity}</p>
                        <p className="text-sm text-muted-foreground">Last Activity</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account preferences and privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates about your recommendations</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Data Privacy</p>
                        <p className="text-sm text-muted-foreground">Control how your data is used for recommendations</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                      </div>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}