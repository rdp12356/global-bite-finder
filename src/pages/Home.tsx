import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { GraduationCap, Target, TrendingUp, Award } from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Your Career Path Starts Here
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            AI-powered career guidance platform that analyzes your marks, aptitude, and interests
            to recommend the perfect career pathway from school to your dream job.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-card p-6 rounded-lg border">
            <GraduationCap className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Smart Analysis</h3>
            <p className="text-muted-foreground">
              AI analyzes your academic performance and quiz responses to understand your strengths
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <Target className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Personalized Recommendations</h3>
            <p className="text-muted-foreground">
              Get tailored career suggestions based on your interests and abilities
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <TrendingUp className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Career Pathways</h3>
            <p className="text-muted-foreground">
              Step-by-step roadmap from school subjects to your dream career
            </p>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <Award className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">College Matching</h3>
            <p className="text-muted-foreground">
              Find the best colleges and courses that match your career goals
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Enter Your Marks</h3>
            <p className="text-muted-foreground">
              Input your academic performance across different subjects
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Take Quiz</h3>
            <p className="text-muted-foreground">
              Answer questions about your interests and aptitude
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Recommendations</h3>
            <p className="text-muted-foreground">
              Receive AI-powered career and college recommendations
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
