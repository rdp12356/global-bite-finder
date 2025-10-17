'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface User {
  id: string
  name: string
  email: string
  image?: string
  tasteProfile?: {
    preferences: string[]
    dietaryRestrictions: string[]
    favoriteCuisines: string[]
    spiceLevel: 'mild' | 'medium' | 'hot'
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  updateTasteProfile: (profile: Partial<User['tasteProfile']>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
    } else if (session?.user) {
      setUser({
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image,
        tasteProfile: {
          preferences: [],
          dietaryRestrictions: [],
          favoriteCuisines: [],
          spiceLevel: 'medium'
        }
      })
      setLoading(false)
    } else {
      setUser(null)
      setLoading(false)
    }
  }, [session, status])

  const updateTasteProfile = (profile: Partial<User['tasteProfile']>) => {
    if (user) {
      setUser({
        ...user,
        tasteProfile: {
          ...user.tasteProfile,
          ...profile
        }
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, updateTasteProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}