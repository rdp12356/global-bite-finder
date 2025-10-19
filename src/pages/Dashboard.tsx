import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ClipboardCheck, TrendingUp, School } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchUserRole = async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      setUserRole(data?.role || "student");
    };

    fetchUserRole();
  }, [user, navigate]);

  if (userRole === "super_admin" || userRole === "admin") {
    navigate("/admin");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/marks")}>
          <CardHeader>
            <BookOpen className="w-10 h-10 text-primary mb-2" />
            <CardTitle>Enter Marks</CardTitle>
            <CardDescription>Add your academic performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Manage Marks</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/quiz")}>
          <CardHeader>
            <ClipboardCheck className="w-10 h-10 text-primary mb-2" />
            <CardTitle>Take Quiz</CardTitle>
            <CardDescription>Answer aptitude questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Start Quiz</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/recommendations")}>
          <CardHeader>
            <TrendingUp className="w-10 h-10 text-primary mb-2" />
            <CardTitle>View Recommendations</CardTitle>
            <CardDescription>AI-powered career guidance</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">View Results</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/pathways")}>
          <CardHeader>
            <School className="w-10 h-10 text-primary mb-2" />
            <CardTitle>Career Pathways</CardTitle>
            <CardDescription>Explore career paths</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Explore Paths</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
