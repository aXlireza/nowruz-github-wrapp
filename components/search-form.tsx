"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Terminal } from "lucide-react"
import { LoginButton } from "@/components/login-button"

export function SearchForm() {
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)
    router.push(`/?username=${encodeURIComponent(username.trim())}`)

    // Reset loading after navigation
    setTimeout(() => setIsLoading(false), 500)
  }

  return (
    <div className="max-w-xl mx-auto mb-8">
      <div className="terminal-card mb-4">
        <div className="terminal-header">
          <div className="terminal-circle red"></div>
          <div className="terminal-circle yellow"></div>
          <div className="terminal-circle green"></div>
          <span className="ml-2 text-sm text-muted-foreground">dev@github-stories: ~</span>
        </div>
        <div className="terminal-body">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex items-center text-muted-foreground mr-2">
              <Terminal className="h-4 w-4 mr-2" />
              <span>$</span>
            </div>
            <Input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-background/50 border-muted focus:border-primary"
            />
            <Button type="submit" disabled={isLoading} className="glow-effect">
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">or</span>
          <LoginButton />
        </div>
      </div>
    </div>
  )
}

