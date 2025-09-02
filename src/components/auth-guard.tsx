'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = localStorage.getItem('planpal_authenticated')
    if (authStatus === 'true') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (password: string) => {
    const correctPassword = process.env.NEXT_PUBLIC_APP_PASSWORD || 'SmarterAI2025'
    
    // Trim whitespace to handle any hidden characters
    const trimmedPassword = password.trim()
    const trimmedCorrect = correctPassword.trim()
    
    if (trimmedPassword === trimmedCorrect) {
      localStorage.setItem('planpal_authenticated', 'true')
      setIsAuthenticated(true)
    } else {
      alert('Incorrect password. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('planpal_authenticated')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-[#ffb829] to-[#e6a025] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading PlanPal AI...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />
  }

  return <>{children}</>
}

function LoginForm({ onLogin }: { onLogin: (password: string) => void }) {
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {/* Logo */}
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-[#ffb829] to-[#e6a025] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">PlanPal AI</h2>
          <p className="text-gray-600 mb-8">Enter your access code to continue</p>
        </div>
        
        <div className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-white/95 group">
          {/* Animated Border Trail */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#ffb829] via-[#e6a025] to-[#ffb829] opacity-20 group-hover:opacity-30 transition-opacity duration-300 rounded-xl"></div>
          <div className="absolute inset-[1px] bg-white rounded-xl"></div>
          
          <form className="relative space-y-6 p-8" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="sr-only">
                Access Code
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full px-4 py-4 border border-gray-200 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffb829] focus:border-[#ffb829] focus:z-10 text-center text-lg bg-white/80 backdrop-blur-sm"
                placeholder="Enter access code"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-4 px-6 border border-transparent text-lg font-medium rounded-lg text-white bg-gradient-to-r from-[#ffb829] to-[#e6a025] hover:from-[#e6a025] hover:to-[#ffb829] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffb829] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Access PlanPal AI
                </span>
              </button>
            </div>
          </form>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Need access? Contact your PlanPal AI representative.
          </p>
        </div>
      </div>
    </div>
  )
}
