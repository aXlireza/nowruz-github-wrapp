"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  token: string | null
  login: (token: string) => void
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
  error: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const isAuthenticated = !!token

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    try {
      // Check for token in localStorage
      const storedToken = localStorage.getItem("github_token")
      if (storedToken) {
        console.log("Found token in localStorage")
        setToken(storedToken)
      }

      // Check for token in URL parameters (from OAuth callback)
      const urlParams = new URLSearchParams(window.location.search)
      const urlToken = urlParams.get("token")
      const urlError = urlParams.get("error")

      if (urlError) {
        console.error("Auth error from URL:", urlError)
        setError(urlError)

        // Clean URL by removing error parameter
        const cleanUrl = window.location.pathname
        window.history.replaceState({}, document.title, cleanUrl)
      }

      if (urlToken) {
        console.log("Found token in URL")
        setToken(urlToken)
        localStorage.setItem("github_token", urlToken)

        // Validate token by making a test API call
        validateToken(urlToken)

        // Clean URL by removing token parameter
        const cleanUrl = window.location.pathname
        window.history.replaceState({}, document.title, cleanUrl)
      }
    } catch (err) {
      console.error("Error initializing auth:", err)
      setError("Failed to initialize authentication")
    }
  }, [])

  const validateToken = async (tokenToValidate: string) => {
    try {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${tokenToValidate}`,
        },
      })

      if (!response.ok) {
        console.error("Token validation failed:", response.status)
        setError("Invalid authentication token")
        setToken(null)
        localStorage.removeItem("github_token")
      }
    } catch (err) {
      console.error("Error validating token:", err)
    }
  }

  const login = (newToken: string) => {
    setToken(newToken)
    setError(null)
    localStorage.setItem("github_token", newToken)
  }

  const logout = () => {
    setToken(null)
    setError(null)
    localStorage.removeItem("github_token")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

