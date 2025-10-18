import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Plus,
  Trash2,
  Camera
} from 'lucide-react'

interface SubjectMark {
  id: string
  subject: string
  marksObtained: number
  totalMarks: number
  percentage: number
}

const subjects = [
  'English', 'Hindi', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Political Science', 'Economics', 'Business Studies',
  'Accountancy', 'Computer Science', 'Psychology', 'Sociology', 'Philosophy',
  'Physical Education', 'Art', 'Music', 'Dance', 'Home Science'
]

const languages = ['English', 'Hindi', 'French', 'German', 'Spanish', 'Sanskrit']
const coreSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Political Science', 'Economics', 'Business Studies', 'Accountancy', 'Computer Science', 'Psychology', 'Sociology', 'Philosophy']
const optionalSubjects = ['Physical Education', 'Art', 'Music', 'Dance', 'Home Science']

export default function MarksInputPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('manual')
  const [subjectMarks, setSubjectMarks] = useState<SubjectMark[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const addSubject = () => {
    const newSubject: SubjectMark = {
      id: Date.now().toString(),
      subject: '',
      marksObtained: 0,
      totalMarks: 100,
      percentage: 0
    }
    setSubjectMarks([...subjectMarks, newSubject])
  }

  const updateSubject = (id: string, field: keyof SubjectMark, value: string | number) => {
    setSubjectMarks(subjectMarks.map(subject => {
      if (subject.id === id) {
        const updated = { ...subject, [field]: value }
        if (field === 'marksObtained' || field === 'totalMarks') {
          const marks = field === 'marksObtained' ? value as number : updated.marksObtained
          const total = field === 'totalMarks' ? value as number : updated.totalMarks
          updated.percentage = total > 0 ? Math.round((marks / total) * 100 * 100) / 100 : 0
        }
        return updated
      }
      return subject
    }))
  }

  const removeSubject = (id: string) => {
    setSubjectMarks(subjectMarks.filter(subject => subject.id !== id))
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate OCR processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUploadProgress(i)
    }

    // Simulate extracted marks (in real app, this would come from OCR)
    const extractedMarks: SubjectMark[] = [
      { id: '1', subject: 'English', marksObtained: 85, totalMarks: 100, percentage: 85 },
      { id: '2', subject: 'Mathematics', marksObtained: 92, totalMarks: 100, percentage: 92 },
      { id: '3', subject: 'Physics', marksObtained: 78, totalMarks: 100, percentage: 78 },
      { id: '4', subject: 'Chemistry', marksObtained: 88, totalMarks: 100, percentage: 88 },
      { id: '5', subject: 'Biology', marksObtained: 90, totalMarks: 100, percentage: 90 }
    ]

    setSubjectMarks(extractedMarks)
    setIsUploading(false)
  }

  const handleContinue = () => {
    // Save marks to database
    console.log('Saving marks:', subjectMarks)
    navigate('/aptitude-test')
  }

  const totalMarks = subjectMarks.reduce((sum, subject) => sum + subject.marksObtained, 0)
  const totalPossibleMarks = subjectMarks.reduce((sum, subject) => sum + subject.totalMarks, 0)
  const overallPercentage = totalPossibleMarks > 0 ? Math.round((totalMarks / totalPossibleMarks) * 100 * 100) / 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Marks Input</h1>
                <p className="text-muted-foreground">Step 1 of 4 - Enter your academic marks</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Step 1 of 4</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">25% Complete</span>
            </div>
            <Progress value={25} className="h-2" />
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="upload">Upload Marksheet</TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Enter Your Marks Manually</CardTitle>
                  <CardDescription>
                    Add your subjects and marks. You can add as many subjects as needed.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subjectMarks.map((subject, index) => (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg"
                    >
                      <div className="md:col-span-2">
                        <Label htmlFor={`subject-${subject.id}`}>Subject</Label>
                        <Select
                          value={subject.subject}
                          onValueChange={(value) => updateSubject(subject.id, 'subject', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map(subjectName => (
                              <SelectItem key={subjectName} value={subjectName}>
                                {subjectName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`obtained-${subject.id}`}>Marks Obtained</Label>
                        <Input
                          id={`obtained-${subject.id}`}
                          type="number"
                          value={subject.marksObtained}
                          onChange={(e) => updateSubject(subject.id, 'marksObtained', parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`total-${subject.id}`}>Total Marks</Label>
                        <Input
                          id={`total-${subject.id}`}
                          type="number"
                          value={subject.totalMarks}
                          onChange={(e) => updateSubject(subject.id, 'totalMarks', parseInt(e.target.value) || 0)}
                          min="1"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="flex-1">
                          <Label>Percentage</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={subject.percentage}
                              disabled
                              className="bg-gray-50"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSubject(subject.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={addSubject}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subject
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Your Marksheet</CardTitle>
                  <CardDescription>
                    Upload an image of your marksheet and we'll extract the marks automatically using OCR.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="marksheet-upload"
                    />
                    <label
                      htmlFor="marksheet-upload"
                      className="cursor-pointer flex flex-col items-center space-y-4"
                    >
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <Camera className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">Upload Marksheet Image</p>
                        <p className="text-muted-foreground">
                          Click to select or drag and drop your marksheet image
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Supports JPG, PNG, PDF formats
                        </p>
                      </div>
                    </label>
                  </div>

                  {isUploading && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Processing Image...</span>
                        <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Summary */}
          {subjectMarks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Marks Summary</CardTitle>
                  <CardDescription>
                    Review your entered marks before proceeding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{subjectMarks.length}</p>
                      <p className="text-sm text-muted-foreground">Subjects</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{totalMarks}</p>
                      <p className="text-sm text-muted-foreground">Total Marks Obtained</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{overallPercentage}%</p>
                      <p className="text-sm text-muted-foreground">Overall Percentage</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button 
              onClick={handleContinue}
              disabled={subjectMarks.length === 0}
            >
              Continue to Aptitude Tests
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}