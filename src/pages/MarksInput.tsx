import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDropzone } from "react-dropzone";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Trash2,
  Plus,
  Eye,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface SubjectMarks {
  id: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
}

const MarksInput = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [marks, setMarks] = useState<SubjectMarks[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [academicYear, setAcademicYear] = useState("2023-24");
  const [examType, setExamType] = useState("board");

  const subjects = [
    "English", "Hindi", "Mathematics", "Physics", "Chemistry", "Biology", 
    "Computer Science", "Accountancy", "Business Studies", "Economics", 
    "History", "Political Science", "Geography", "Psychology", "Sociology"
  ];

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      // In a real app, you would send this to your OCR service
      // For now, we'll simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock OCR results
      const mockResults: SubjectMarks[] = [
        { id: "1", subject: "English", marksObtained: 85, totalMarks: 100, percentage: 85 },
        { id: "2", subject: "Mathematics", marksObtained: 92, totalMarks: 100, percentage: 92 },
        { id: "3", subject: "Physics", marksObtained: 88, totalMarks: 100, percentage: 88 },
        { id: "4", subject: "Chemistry", marksObtained: 90, totalMarks: 100, percentage: 90 },
        { id: "5", subject: "Biology", marksObtained: 87, totalMarks: 100, percentage: 87 },
      ];

      setMarks(mockResults);
      toast({
        title: "Marksheet processed successfully!",
        description: "Please review and adjust the extracted marks if needed.",
      });
    } catch (error) {
      toast({
        title: "Error processing marksheet",
        description: "Please try again or enter marks manually.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.pdf']
    },
    multiple: false
  });

  const addSubject = () => {
    const newSubject: SubjectMarks = {
      id: Date.now().toString(),
      subject: "",
      marksObtained: 0,
      totalMarks: 100,
      percentage: 0
    };
    setMarks([...marks, newSubject]);
  };

  const updateSubject = (id: string, field: keyof SubjectMarks, value: string | number) => {
    setMarks(marks.map(mark => {
      if (mark.id === id) {
        const updated = { ...mark, [field]: value };
        if (field === 'marksObtained' || field === 'totalMarks') {
          updated.percentage = (updated.marksObtained / updated.totalMarks) * 100;
        }
        return updated;
      }
      return mark;
    }));
  };

  const removeSubject = (id: string) => {
    setMarks(marks.filter(mark => mark.id !== id));
  };

  const saveMarks = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save your marks.",
        variant: "destructive",
      });
      return;
    }

    try {
      // In a real app, you would save to Supabase here
      toast({
        title: "Marks saved successfully!",
        description: "Your academic performance has been recorded.",
      });
    } catch (error) {
      toast({
        title: "Error saving marks",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const overallPercentage = marks.length > 0 
    ? marks.reduce((sum, mark) => sum + mark.percentage, 0) / marks.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Enter Your Academic Marks
          </h1>
          <p className="text-xl text-gray-600">
            Upload your marksheet or enter marks manually to get started with personalized recommendations.
          </p>
        </motion.div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Marksheet</TabsTrigger>
            <TabsTrigger value="manual">Enter Manually</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-6 w-6 text-blue-600" />
                  Upload Your Marksheet
                </CardTitle>
                <CardDescription>
                  Upload a clear image or PDF of your marksheet. Our AI will extract the marks automatically.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input {...getInputProps()} />
                  {isProcessing ? (
                    <div className="space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-lg font-medium">Processing your marksheet...</p>
                      <p className="text-sm text-gray-500">This may take a few moments</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium">
                          {isDragActive ? 'Drop the file here' : 'Drag & drop your marksheet here'}
                        </p>
                        <p className="text-sm text-gray-500">
                          or click to browse (PNG, JPG, PDF)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-green-600" />
                  Enter Marks Manually
                </CardTitle>
                <CardDescription>
                  Add your subjects and marks one by one.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marks.map((mark, index) => (
                    <motion.div
                      key={mark.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 border rounded-lg bg-white"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor={`subject-${mark.id}`}>Subject</Label>
                          <Select
                            value={mark.subject}
                            onValueChange={(value) => updateSubject(mark.id, 'subject', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map(subject => (
                                <SelectItem key={subject} value={subject}>
                                  {subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`obtained-${mark.id}`}>Marks Obtained</Label>
                          <Input
                            type="number"
                            value={mark.marksObtained}
                            onChange={(e) => updateSubject(mark.id, 'marksObtained', parseInt(e.target.value) || 0)}
                            min="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`total-${mark.id}`}>Total Marks</Label>
                          <Input
                            type="number"
                            value={mark.totalMarks}
                            onChange={(e) => updateSubject(mark.id, 'totalMarks', parseInt(e.target.value) || 100)}
                            min="1"
                          />
                        </div>
                        <div className="flex items-end">
                          <Badge variant="secondary" className="w-full justify-center">
                            {mark.percentage.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubject(mark.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary and Actions */}
        {marks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  Marks Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{marks.length}</p>
                    <p className="text-sm text-gray-500">Subjects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {overallPercentage.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">Overall Percentage</p>
                  </div>
                  <div className="text-center">
                    <Badge 
                      variant={overallPercentage >= 90 ? "default" : overallPercentage >= 75 ? "secondary" : "destructive"}
                      className="text-lg px-4 py-2"
                    >
                      {overallPercentage >= 90 ? "Excellent" : overallPercentage >= 75 ? "Good" : "Needs Improvement"}
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Button onClick={saveMarks} className="flex-1">
                    Save Marks & Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Export Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MarksInput;