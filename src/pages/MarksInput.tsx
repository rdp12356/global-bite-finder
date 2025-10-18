import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Edit3, Check, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface SubjectMarks {
  subject: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
}

const MarksInput = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedMarks, setExtractedMarks] = useState<SubjectMarks[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [board, setBoard] = useState("");
  const [currentClass, setCurrentClass] = useState("");

  const subjects = [
    "English", "Hindi", "Mathematics", "Physics", "Chemistry", "Biology",
    "History", "Geography", "Political Science", "Economics", "Business Studies",
    "Computer Science", "Physical Education", "Art", "Music", "French", "German", "Spanish"
  ];

  const boards = [
    "CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"
  ];

  const classes = [
    { value: "10", label: "Class 10" },
    { value: "11", label: "Class 11" },
    { value: "12", label: "Class 12" }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsUploading(true);

    try {
      // Simulate OCR processing - in real implementation, use Tesseract.js or Vision API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock extracted data - replace with actual OCR results
      const mockExtractedMarks: SubjectMarks[] = [
        { subject: "English", marksObtained: 85, totalMarks: 100, percentage: 85 },
        { subject: "Mathematics", marksObtained: 92, totalMarks: 100, percentage: 92 },
        { subject: "Physics", marksObtained: 78, totalMarks: 100, percentage: 78 },
        { subject: "Chemistry", marksObtained: 88, totalMarks: 100, percentage: 88 },
        { subject: "Biology", marksObtained: 90, totalMarks: 100, percentage: 90 }
      ];
      
      setExtractedMarks(mockExtractedMarks);
      setIsEditing(true);
    } catch (error) {
      console.error("OCR processing failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleManualEntry = () => {
    setExtractedMarks([
      { subject: "", marksObtained: 0, totalMarks: 100, percentage: 0 }
    ]);
    setIsEditing(true);
  };

  const updateMark = (index: number, field: keyof SubjectMarks, value: string | number) => {
    const updatedMarks = [...extractedMarks];
    updatedMarks[index] = { ...updatedMarks[index], [field]: value };
    
    if (field === "marksObtained" || field === "totalMarks") {
      const marksObtained = field === "marksObtained" ? Number(value) : updatedMarks[index].marksObtained;
      const totalMarks = field === "totalMarks" ? Number(value) : updatedMarks[index].totalMarks;
      updatedMarks[index].percentage = totalMarks > 0 ? Math.round((marksObtained / totalMarks) * 100) : 0;
    }
    
    setExtractedMarks(updatedMarks);
  };

  const addSubject = () => {
    setExtractedMarks([...extractedMarks, { subject: "", marksObtained: 0, totalMarks: 100, percentage: 0 }]);
  };

  const removeSubject = (index: number) => {
    setExtractedMarks(extractedMarks.filter((_, i) => i !== index));
  };

  const saveMarks = async () => {
    if (!user || !board || !currentClass) return;

    try {
      // Create or get student record
      const { data: student, error: studentError } = await supabase
        .from("students")
        .upsert({
          user_id: user.id,
          current_class: parseInt(currentClass),
          board: board
        })
        .select()
        .single();

      if (studentError) throw studentError;

      // Save marks
      const marksData = extractedMarks.map(mark => ({
        student_id: student.id,
        subject: mark.subject,
        marks_obtained: mark.marksObtained,
        total_marks: mark.totalMarks,
        percentage: mark.percentage
      }));

      const { error: marksError } = await supabase
        .from("marks")
        .upsert(marksData);

      if (marksError) throw marksError;

      navigate("/aptitude-test");
    } catch (error) {
      console.error("Error saving marks:", error);
    }
  };

  const isFormValid = board && currentClass && extractedMarks.every(mark => 
    mark.subject && mark.marksObtained > 0 && mark.totalMarks > 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Enter Your Marks
          </h1>
          <p className="text-xl text-gray-600">
            Upload your marksheet or enter marks manually to get started
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Marksheet
              </CardTitle>
              <CardDescription>
                Upload an image of your marksheet and we'll extract the data automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {isUploading ? (
                  <div className="space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600">Processing your marksheet...</p>
                  </div>
                ) : uploadedFile ? (
                  <div className="space-y-4">
                    <FileText className="h-12 w-12 text-green-600 mx-auto" />
                    <p className="text-green-600 font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-600">Click to upload a different file</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="text-gray-600">Click to upload marksheet image</p>
                    <p className="text-sm text-gray-500">Supports JPG, PNG, PDF formats</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Manual Entry Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit3 className="h-5 w-5" />
                Manual Entry
              </CardTitle>
              <CardDescription>
                Prefer to enter your marks manually? No problem!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleManualEntry}
                className="w-full"
                variant="outline"
              >
                Enter Marks Manually
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Basic Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Tell us about your current academic details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="class">Current Class</Label>
                <Select value={currentClass} onValueChange={setCurrentClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.value} value={cls.value}>
                        {cls.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="board">Board</Label>
                <Select value={board} onValueChange={setBoard}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your board" />
                  </SelectTrigger>
                  <SelectContent>
                    {boards.map((boardName) => (
                      <SelectItem key={boardName} value={boardName}>
                        {boardName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marks Table */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Your Marks</CardTitle>
                <CardDescription>
                  Review and edit the extracted marks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {extractedMarks.map((mark, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <div>
                        <Label>Subject</Label>
                        <Select
                          value={mark.subject}
                          onValueChange={(value) => updateMark(index, "subject", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Marks Obtained</Label>
                        <Input
                          type="number"
                          value={mark.marksObtained}
                          onChange={(e) => updateMark(index, "marksObtained", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Total Marks</Label>
                        <Input
                          type="number"
                          value={mark.totalMarks}
                          onChange={(e) => updateMark(index, "totalMarks", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Percentage</Label>
                        <div className="flex items-center h-10 px-3 py-2 border border-input bg-background rounded-md">
                          <Badge variant="secondary">{mark.percentage}%</Badge>
                        </div>
                      </div>
                      <div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeSubject(index)}
                          disabled={extractedMarks.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={addSubject}
                    className="w-full"
                  >
                    Add Another Subject
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-end gap-4 mt-8"
          >
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveMarks}
              disabled={!isFormValid}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Save & Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MarksInput;