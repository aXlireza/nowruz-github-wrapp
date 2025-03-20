"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Github, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export function LoginButton() {
  const { isAuthenticated, logout, error } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Show error toast if there's an authentication error
  if (error) {
    toast({
      title: "Authentication Error",
      description: `Failed to authenticate with GitHub: ${error}`,
      variant: "destructive",
    })
  }

  const handleLogin = async () => {
    if (isAuthenticated) {
      logout()
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
      return
    }

    setIsLoading(true)

    try {
      // Redirect to GitHub OAuth endpoint
      window.location.href = "/api/auth/github"
    } catch (err) {
      console.error("Login error:", err)
      toast({
        title: "Login Failed",
        description: "There was a problem logging in with GitHub. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      variant={isAuthenticated ? "destructive" : "secondary"}
      className="flex items-center gap-2 glow-effect"
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="w-4 h-4" />}
      {isAuthenticated ? "Sign Out" : "Login with GitHub"}
    </Button>
  )
}

