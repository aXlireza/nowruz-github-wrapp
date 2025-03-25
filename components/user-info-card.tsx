"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye, Github, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ShamsiCalendar from "./calendar/shamsi-calendar"

interface UserInfo {
  login: string
  name: string | null
  avatar_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
}

export function UserInfoCard() {
  const { isAuthenticated, token } = useAuth()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setUser(null)
      return
    }

    const fetchUserInfo = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log("Fetching user info with token")
        const response = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `token ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`)
        }

        const userData = await response.json()
        setUser(userData)
      } catch (err) {
        console.error("Error fetching user data:", err)
        setError(err instanceof Error ? err.message : "Failed to load user data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [isAuthenticated, token])

  if (!isAuthenticated || !token) {
    return null
  }

  if (loading) {
    return (
      <div className="w-full max-w-md terminal-card">
        <div className="terminal-header">
          <div className="terminal-circle red"></div>
          <div className="terminal-circle yellow"></div>
          <div className="terminal-circle green"></div>
          <span className="ml-2 text-sm text-muted-foreground">loading-profile.js</span>
        </div>
        <div className="terminal-body p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error loading GitHub profile: {error}</AlertDescription>
      </Alert>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="w-full max-w-md terminal-card">
      <ShamsiCalendar username={user.login} isAuthenticated={isAuthenticated} />
      <div className="terminal-header">
        <div className="terminal-circle red"></div>
        <div className="terminal-circle yellow"></div>
        <div className="terminal-circle green"></div>
        <span className="ml-2 text-sm text-muted-foreground">profile.js</span>
      </div>
      <div className="terminal-body p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarImage src={user.avatar_url} alt={user.login} />
            <AvatarFallback>{user.login.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center">
              <Github className="h-4 w-4 mr-2 text-primary" />
              <p className="text-lg font-bold">{user.name || user.login}</p>
            </div>
            <p className="text-sm text-muted-foreground">@{user.login}</p>
            {user.bio && <p className="text-sm mt-1">{user.bio}</p>}
            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 bg-muted rounded-md">{user.public_repos} repos</span>
              <span className="px-2 py-1 bg-muted rounded-md">{user.followers} followers</span>
              <span className="px-2 py-1 bg-muted rounded-md">{user.following} following</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/?username=${user.login}`, "_self")}
            className="flex items-center gap-1"
          >
            <Eye className="h-3 w-3" />
            View My GitHub Stories
          </Button>
        </div>
      </div>
    </div>
  )
}

