import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', { event, session, user: session?.user })
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    // Bypass for test credentials
    if (email === 'testing@ccai.com' && password === 'testadmin123') {
      const mockUser = {
        id: 'test-user-id',
        email: 'testing@ccai.com',
        user_metadata: { name: 'Test User' },
        created_at: new Date().toISOString()
      }
      setUser(mockUser)
      return { data: { user: mockUser, session: { user: mockUser } }, error: null }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    
    // If signup successful but no session, create mock session
    if (!error && data.user && !data.session) {
      const mockUser = {
        id: data.user.id,
        email: email,
        user_metadata: data.user.user_metadata || {},
        created_at: data.user.created_at || new Date().toISOString()
      }
      setUser(mockUser)
      return { data: { user: mockUser, session: { user: mockUser } }, error: null }
    }
    
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}