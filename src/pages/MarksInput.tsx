import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { createWorker } from "tesseract.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MarksService, type MarksData } from "@/services/marksService";

interface Subject {
  id: string;
  name: string;
  marks: number;
  maxMarks: number;
  type: 'language' | 'core' | 'optional';
}

const MarksInput = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'English', marks: 0, maxMarks: 100, type: 'language' },
    { id: '2', name: 'Mathematics', marks: 0, maxMarks: 100, type: 'core' },
    { id: '3', name: 'Physics', marks: 0, maxMarks: 100, type: 'core' },
    { id: '4', name: 'Chemistry', marks: 0, maxMarks: 100, type: 'core' },
    { id: '5', name: 'Biology', marks: 0, maxMarks: 100, type: 'core' },
    { id: '6', name: 'Social Studies', marks: 0, maxMarks: 100, type: 'core' },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [interestArea, setInterestArea] = useState<string>("");
  const [interestAreas, setInterestAreas] = useState<Array<{id: string, name: string}>>([]);

  // Load interest areas from database
  useEffect(() => {
    const loadInterestAreas = async () => {
      const result = await MarksService.getInterestAreas();
      if (result.success && result.data) {
        setInterestAreas(result.data);
      }
    };
    loadInterestAreas();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    setOcrError(null);

    try {
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      // Parse the OCR text to extract marks
      const extractedMarks = parseMarksFromText(text);
      if (extractedMarks.length > 0) {
        setSubjects(prev => prev.map(subject => {
          const extracted = extractedMarks.find(m => 
            m.subject.toLowerCase().includes(subject.name.toLowerCase()) ||
            subject.name.toLowerCase().includes(m.subject.toLowerCase())
          );
          return extracted ? { ...subject, marks: extracted.marks } : subject;
        }));
      } else {
        setOcrError("Could not extract marks from the image. Please enter marks manually.");
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setOcrError("Failed to process the image. Please try again or enter marks manually.");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp']
    },
    multiple: false
  });

  const parseMarksFromText = (text: string) => {
    const marks: { subject: string; marks: number }[] = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      const match = line.match(/([a-zA-Z\s]+)\s*:?\s*(\d+)\s*\/?\s*(\d+)?/i);
      if (match) {
        const subject = match[1].trim();
        const marksObtained = parseInt(match[2]);
        marks.push({ subject, marks: marksObtained });
      }
    });
    
    return marks;
  };

  const updateSubjectMarks = (id: string, marks: number) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === id ? { ...subject, marks } : subject
    ));
  };

  const updateSubjectMaxMarks = (id: string, maxMarks: number) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === id ? { ...subject, maxMarks } : subject
    ));
  };

  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: '',
      marks: 0,
      maxMarks: 100,
      type: 'core'
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const removeSubject = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
  };

  const updateSubjectName = (id: string, name: string) => {
    setSubjects(prev => prev.map(subject => 
      subject.id === id ? { ...subject, name } : subject
    ));
  };

  const calculatePercentage = (marks: number, maxMarks: number) => {
    return maxMarks > 0 ? ((marks / maxMarks) * 100).toFixed(1) : '0.0';
  };

  const totalMarks = subjects.reduce((sum, subject) => sum + subject.marks, 0);
  const totalMaxMarks = subjects.reduce((sum, subject) => sum + subject.maxMarks, 0);
  const overallPercentage = calculatePercentage(totalMarks, totalMaxMarks);

  const handleContinue = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please sign in to continue.',
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Store marks data in localStorage for immediate use
      const marksData: MarksData = {
        subjects,
        interestArea,
        totalMarks,
        totalMaxMarks,
        overallPercentage: parseFloat(overallPercentage)
      };
      localStorage.setItem('marksData', JSON.stringify(marksData));

      // Save to database
      const result = await MarksService.saveMarks(user.id, marksData);
      
      if (result.success) {
        toast({
          title: 'Marks saved successfully!',
          description: 'Your academic data has been recorded.',
        });
        navigate('/aptitude');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error saving marks',
          description: 'Please try again or contact support.',
        });
      }
    } catch (error) {
      console.error('Error saving marks:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving marks',
        description: 'Please try again or contact support.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Enter Your Academic Marks
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload your marksheet image or enter marks manually. Our AI will analyze your performance 
              across all subjects to provide personalized recommendations.
            </p>
          </div>

          {/* OCR Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Marksheet Image
              </CardTitle>
              <CardDescription>
                Upload a clear image of your marksheet and we'll automatically extract your marks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
              >
                <input {...getInputProps()} />
                {isProcessing ? (
                  <div className="space-y-4">
                    <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
                    <p className="text-lg font-medium">Processing your marksheet...</p>
                    <p className="text-sm text-gray-500">This may take a few moments</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium">
                        {isDragActive ? 'Drop the file here' : 'Drag & drop your marksheet here'}
                      </p>
                      <p className="text-sm text-gray-500">
                        or click to select a file (PNG, JPG, JPEG, GIF, BMP, WEBP)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {ocrError && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{ocrError}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Manual Entry Section */}
          <Card>
            <CardHeader>
              <CardTitle>Marks Entry Table</CardTitle>
              <CardDescription>
                Review and adjust the extracted marks or enter them manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Marks Obtained</TableHead>
                      <TableHead>Maximum Marks</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell>
                          <Input
                            value={subject.name}
                            onChange={(e) => updateSubjectName(subject.id, e.target.value)}
                            placeholder="Subject name"
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={subject.marks}
                            onChange={(e) => updateSubjectMarks(subject.id, parseInt(e.target.value) || 0)}
                            min="0"
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={subject.maxMarks}
                            onChange={(e) => updateSubjectMaxMarks(subject.id, parseInt(e.target.value) || 100)}
                            min="1"
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {calculatePercentage(subject.marks, subject.maxMarks)}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSubject(subject.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Button variant="outline" onClick={addSubject} className="w-full">
                  Add Subject
                </Button>

                {/* Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Total Marks:</span>
                    <span className="text-lg font-bold">
                      {totalMarks} / {totalMaxMarks} ({overallPercentage}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interest Area Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Interest Area</CardTitle>
              <CardDescription>
                Select the field that interests you most for better recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="interest">Choose your interest area</Label>
                <Select value={interestArea} onValueChange={setInterestArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an interest area" />
                  </SelectTrigger>
                  <SelectContent>
                    {interestAreas.map((area) => (
                      <SelectItem key={area.id} value={area.name}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button 
              size="lg" 
              onClick={handleContinue}
              disabled={subjects.some(s => s.name.trim() === '') || !interestArea || isSaving}
              className="px-8 py-6 text-lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Continue to Aptitude Tests
                  <CheckCircle className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MarksInput;