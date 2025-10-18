import { GraduationCap, User, BookOpen, Brain, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Zertainity
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          {user && (
            <>
              <Button variant="ghost" onClick={() => navigate('/marks')}>
                <BookOpen className="w-4 h-4 mr-2" />
                Marks
              </Button>
              <Button variant="ghost" onClick={() => navigate('/aptitude-test')}>
                <Brain className="w-4 h-4 mr-2" />
                Aptitude Test
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/marks')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Enter Marks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/aptitude-test')}>
                  <Brain className="w-4 h-4 mr-2" />
                  Aptitude Test
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/ai-coach')}>
                  <User className="w-4 h-4 mr-2" />
                  AI Coach
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/recommendations')}>
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Recommendations
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => navigate('/auth')} size="sm">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
