import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from 'next-themes'

// Pages
import HomePage from '@/pages/HomePage'
import AuthPage from '@/pages/AuthPage'
import DashboardPage from '@/pages/DashboardPage'
import MarksInputPage from '@/pages/MarksInputPage'
import AptitudeTestPage from '@/pages/AptitudeTestPage'
import AIChatPage from '@/pages/AIChatPage'
import RecommendationsPage from '@/pages/RecommendationsPage'
import ProfilePage from '@/pages/ProfilePage'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/marks" element={<MarksInputPage />} />
                <Route path="/aptitude-test" element={<AptitudeTestPage />} />
                <Route path="/ai-chat" element={<AIChatPage />} />
                <Route path="/recommendations" element={<RecommendationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App