import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Calculator, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubjectMarks {
  subject: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
}

const MarksInput = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("manual");
  const [subjects, setSubjects] = useState<SubjectMarks[]>([
    { subject: "English", marksObtained: 0, totalMarks: 100, percentage: 0 },
    { subject: "Mathematics", marksObtained: 0, totalMarks: 100, percentage: 0 },
    { subject: "Physics", marksObtained: 0, totalMarks: 100, percentage: 0 },
    { subject: "Chemistry", marksObtained: 0, totalMarks: 100, percentage: 0 },
    { subject: "Biology", marksObtained: 0, totalMarks: 100, percentage: 0 },
  ]);
  const [additionalSubjects, setAdditionalSubjects] = useState<SubjectMarks[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const commonSubjects = [
    "English", "Hindi", "Mathematics", "Physics", "Chemistry", "Biology",
    "Economics", "Business Studies", "Accountancy", "History", "Geography",
    "Political Science", "Computer Science", "Physical Education"
  ];

  const boards = ["CBSE", "ICSE", "State Board", "IB", "Cambridge"];

  const updateSubjectMarks = (index: number, field: keyof SubjectMarks, value: string | number) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value
    };
    
    if (field === "marksObtained" || field === "totalMarks") {
      const marksObtained = field === "marksObtained" ? Number(value) : updatedSubjects[index].marksObtained;
      const totalMarks = field === "totalMarks" ? Number(value) : updatedSubjects[index].totalMarks;
      updatedSubjects[index].percentage = totalMarks > 0 ? (marksObtained / totalMarks) * 100 : 0;
    }
    
    setSubjects(updatedSubjects);
  };

  const addSubject = () => {
    setAdditionalSubjects([...additionalSubjects, {
      subject: "",
      marksObtained: 0,
      totalMarks: 100,
      percentage: 0
    }]);
  };

  const updateAdditionalSubject = (index: number, field: keyof SubjectMarks, value: string | number) => {
    const updatedSubjects = [...additionalSubjects];
    updatedSubjects[index] = {
      ...updatedSubjects[index],
      [field]: value
    };
    
    if (field === "marksObtained" || field === "totalMarks") {
      const marksObtained = field === "marksObtained" ? Number(value) : updatedSubjects[index].marksObtained;
      const totalMarks = field === "totalMarks" ? Number(value) : updatedSubjects[index].totalMarks;
      updatedSubjects[index].percentage = totalMarks > 0 ? (marksObtained / totalMarks) * 100 : 0;
    }
    
    setAdditionalSubjects(updatedSubjects);
  };

  const removeAdditionalSubject = (index: number) => {
    setAdditionalSubjects(additionalSubjects.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // TODO: Implement OCR processing with Tesseract.js
      toast({
        title: "Processing marksheet",
        description: "We're analyzing your marksheet image. This may take a few moments.",
      });
      
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Marksheet processed",
        description: "Please review and adjust the detected marks if needed.",
      });
    } catch (error) {
      toast({
        title: "Error processing marksheet",
        description: "Please try uploading again or enter marks manually.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    const allSubjects = [...subjects, ...additionalSubjects];
    const hasValidMarks = allSubjects.some(subject => subject.marksObtained > 0);
    
    if (!hasValidMarks) {
      toast({
        title: "Please enter marks",
        description: "You need to enter marks for at least one subject to continue.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Save marks to database
    navigate("/aptitude");
  };

  const totalMarks = [...subjects, ...additionalSubjects].reduce((sum, subject) => sum + subject.marksObtained, 0);
  const totalPossibleMarks = [...subjects, ...additionalSubjects].reduce((sum, subject) => sum + subject.totalMarks, 0);
  const overallPercentage = totalPossibleMarks > 0 ? (totalMarks / totalPossibleMarks) * 100 : 0;

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
            Enter Your Academic Performance
          </h1>
          <p className="text-xl text-gray-600">
            Upload your marksheet or enter marks manually to get started
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
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
                <CardTitle>Core Subjects</CardTitle>
                <CardDescription>
                  Enter your marks for the main subjects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <Label htmlFor={`subject-${index}`}>Subject</Label>
                      <Input
                        id={`subject-${index}`}
                        value={subject.subject}
                        onChange={(e) => updateSubjectMarks(index, "subject", e.target.value)}
                        placeholder="Subject name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`marks-${index}`}>Marks Obtained</Label>
                      <Input
                        id={`marks-${index}`}
                        type="number"
                        value={subject.marksObtained}
                        onChange={(e) => updateSubjectMarks(index, "marksObtained", e.target.value)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`total-${index}`}>Total Marks</Label>
                      <Input
                        id={`total-${index}`}
                        type="number"
                        value={subject.totalMarks}
                        onChange={(e) => updateSubjectMarks(index, "totalMarks", e.target.value)}
                        placeholder="100"
                        min="1"
                      />
                    </div>
                    <div>
                      <Label>Percentage</Label>
                      <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md">
                        <span className="text-sm font-medium">
                          {subject.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Additional Subjects</CardTitle>
                    <CardDescription>
                      Add any other subjects you've studied
                    </CardDescription>
                  </div>
                  <Button onClick={addSubject} variant="outline">
                    Add Subject
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {additionalSubjects.map((subject, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                      <Label htmlFor={`add-subject-${index}`}>Subject</Label>
                      <Select
                        value={subject.subject}
                        onValueChange={(value) => updateAdditionalSubject(index, "subject", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {commonSubjects.map((sub) => (
                            <SelectItem key={sub} value={sub}>
                              {sub}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`add-marks-${index}`}>Marks Obtained</Label>
                      <Input
                        id={`add-marks-${index}`}
                        type="number"
                        value={subject.marksObtained}
                        onChange={(e) => updateAdditionalSubject(index, "marksObtained", e.target.value)}
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`add-total-${index}`}>Total Marks</Label>
                      <Input
                        id={`add-total-${index}`}
                        type="number"
                        value={subject.totalMarks}
                        onChange={(e) => updateAdditionalSubject(index, "totalMarks", e.target.value)}
                        placeholder="100"
                        min="1"
                      />
                    </div>
                    <div>
                      <Label>Percentage</Label>
                      <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md">
                        <span className="text-sm font-medium">
                          {subject.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAdditionalSubject(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Marksheet</CardTitle>
                <CardDescription>
                  Upload an image of your marksheet and we'll extract the marks automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Upload your marksheet</p>
                    <p className="text-gray-500">
                      Supported formats: JPG, PNG, PDF
                    </p>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="marksheet-upload"
                    />
                    <Button
                      onClick={() => document.getElementById("marksheet-upload")?.click()}
                      disabled={isProcessing}
                      className="mt-4"
                    >
                      {isProcessing ? "Processing..." : "Choose File"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Academic Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {[...subjects, ...additionalSubjects].filter(s => s.marksObtained > 0).length}
                </div>
                <div className="text-gray-600">Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {totalMarks}
                </div>
                <div className="text-gray-600">Total Marks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {overallPercentage.toFixed(1)}%
                </div>
                <div className="text-gray-600">Overall Percentage</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="px-8"
          >
            Back to Home
          </Button>
          <Button
            onClick={handleContinue}
            className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Continue to Aptitude Test
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MarksInput;
