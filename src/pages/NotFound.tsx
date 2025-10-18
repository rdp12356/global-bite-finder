import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="text-lg text-gray-600">
            Oops! The page you're looking for doesn't exist. Let's get you back on track with your academic journey.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            size="lg" 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Home className="h-5 w-5 mr-2" />
            Return to Home
          </Button>
          
          <p className="text-sm text-gray-500">
            Or try one of these popular pages:
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" onClick={() => navigate('/marks')}>
              Enter Marks
            </Button>
            <Button variant="outline" onClick={() => navigate('/aptitude')}>
              Aptitude Tests
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
