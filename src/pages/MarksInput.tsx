import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Calculator, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Subject {
  id: string;
  name: string;
  type: 'language' | 'core' | 'optional';
  marksObtained: number;
  totalMarks: number;
  percentage: number;
}

const MarksInput = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'English', type: 'language', marksObtained: 0, totalMarks: 100, percentage: 0 },
    { id: '2', name: 'Mathematics', type: 'core', marksObtained: 0, totalMarks: 100, percentage: 0 },
    { id: '3', name: 'Science', type: 'core', marksObtained: 0, totalMarks: 100, percentage: 0 },
    { id: '4', name: 'Social Studies', type: 'core', marksObtained: 0, totalMarks: 100, percentage: 0 },
  ]);
  const [board, setBoard] = useState('');
  const [examYear, setExamYear] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const updateSubject = (id: string, field: keyof Subject, value: string | number) => {
    setSubjects(prev => prev.map(subject => {
      if (subject.id === id) {
        const updated = { ...subject, [field]: value };
        if (field === 'marksObtained' || field === 'totalMarks') {
          const marks = field === 'marksObtained' ? Number(value) : subject.marksObtained;
          const total = field === 'totalMarks' ? Number(value) : subject.totalMarks;
          updated.percentage = total > 0 ? Math.round((marks / total) * 100 * 100) / 100 : 0;
        }
        return updated;
      }
      return subject;
    }));
  };

  const addSubject = () => {
    const newId = (subjects.length + 1).toString();
    setSubjects(prev => [...prev, {
      id: newId,
      name: '',
      type: 'core',
      marksObtained: 0,
      totalMarks: 100,
      percentage: 0
    }]);
  };

  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(prev => prev.filter(subject => subject.id !== id));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate OCR processing
    setTimeout(() => {
      // Mock OCR results - in real implementation, use Tesseract.js or Vision API
      setSubjects([
        { id: '1', name: 'English', type: 'language', marksObtained: 85, totalMarks: 100, percentage: 85 },
        { id: '2', name: 'Mathematics', type: 'core', marksObtained: 92, totalMarks: 100, percentage: 92 },
        { id: '3', name: 'Physics', type: 'core', marksObtained: 88, totalMarks: 100, percentage: 88 },
        { id: '4', name: 'Chemistry', type: 'core', marksObtained: 90, totalMarks: 100, percentage: 90 },
        { id: '5', name: 'Biology', type: 'core', marksObtained: 87, totalMarks: 100, percentage: 87 },
      ]);
      setIsUploading(false);
    }, 2000);
  };

  const overallPercentage = subjects.length > 0 
    ? Math.round(subjects.reduce((sum, subject) => sum + subject.percentage, 0) / subjects.length * 100) / 100
    : 0;

  const isComplete = subjects.every(subject => 
    subject.name && subject.marksObtained > 0 && subject.totalMarks > 0
  ) && board && examYear;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Enter Your Academic Marks
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Upload your marksheet or enter marks manually to get started with your personalized recommendations.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Secure & Private</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>AI-Powered Analysis</span>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Marksheet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>
                  Please provide your basic academic information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="board">Education Board</Label>
                    <Select value={board} onValueChange={setBoard}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your board" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cbse">CBSE</SelectItem>
                        <SelectItem value="icse">ICSE</SelectItem>
                        <SelectItem value="state">State Board</SelectItem>
                        <SelectItem value="ib">IB</SelectItem>
                        <SelectItem value="igcse">IGCSE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="examYear">Exam Year</Label>
                    <Select value={examYear} onValueChange={setExamYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Subject-wise Marks</CardTitle>
                    <CardDescription>
                      Enter your marks for each subject
                    </CardDescription>
                  </div>
                  <Button variant="outline" onClick={addSubject}>
                    Add Subject
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subjects.map((subject, index) => (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end"
                    >
                      <div className="space-y-2">
                        <Label>Subject Name</Label>
                        <Input
                          value={subject.name}
                          onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                          placeholder="e.g., Mathematics"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={subject.type}
                          onValueChange={(value: 'language' | 'core' | 'optional') => 
                            updateSubject(subject.id, 'type', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="language">Language</SelectItem>
                            <SelectItem value="core">Core</SelectItem>
                            <SelectItem value="optional">Optional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Marks Obtained</Label>
                        <Input
                          type="number"
                          value={subject.marksObtained}
                          onChange={(e) => updateSubject(subject.id, 'marksObtained', Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Marks</Label>
                        <Input
                          type="number"
                          value={subject.totalMarks}
                          onChange={(e) => updateSubject(subject.id, 'totalMarks', Number(e.target.value))}
                          placeholder="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Percentage</Label>
                        <div className="flex items-center h-10 px-3 py-2 border rounded-md bg-gray-50">
                          <span className="text-sm font-medium">{subject.percentage}%</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>&nbsp;</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSubject(subject.id)}
                          disabled={subjects.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">Overall Percentage:</span>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {overallPercentage}%
                    </Badge>
                  </div>
                  <Progress value={overallPercentage} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Marksheet</CardTitle>
                <CardDescription>
                  Upload a clear image of your marksheet and our AI will extract the marks automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Marksheet Image
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Supported formats: JPG, PNG, PDF (Max 10MB)
                  </p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="marksheet-upload"
                  />
                  <label htmlFor="marksheet-upload">
                    <Button asChild>
                      <span>
                        {isUploading ? "Processing..." : "Choose File"}
                      </span>
                    </Button>
                  </label>
                  {isUploading && (
                    <div className="mt-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-2">Extracting marks from your marksheet...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center mt-8"
        >
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
          <Button
            onClick={() => navigate("/aptitude")}
            disabled={!isComplete}
            className="flex items-center gap-2"
          >
            Continue to Aptitude Tests
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default MarksInput;
