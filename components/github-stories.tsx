"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { updateOctokit } from "@/lib/github-service"
import { StoryView } from "@/components/story-view"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Github, Code, Terminal } from "lucide-react"
import { PerformanceBadge } from "@/components/performance-badge"
import { useAuth } from "@/contexts/auth-context"

export function GitHubStories() {
  const searchParams = useSearchParams()
  const username = searchParams.get("username")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showBadge, setShowBadge] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStage, setLoadingStage] = useState(0)
  const [showStories, setShowStories] = useState(false)
  const loadingInterval = useRef<NodeJS.Timeout | null>(null)
  const { token, isAuthenticated } = useAuth()

  const loadingStages = [
    "Connecting to GitHub...",
    "Fetching user profile...",
    "Loading repositories...",
    "Analyzing contributions...",
    "Calculating statistics...",
    "Preparing visualization...",
    "Almost ready...",
  ]

  useEffect(() => {
    if (isAuthenticated && token) {
      updateOctokit(token)
    }
  }, [isAuthenticated, token])

  useEffect(() => {
    if (!username) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      setShowBadge(false)
      setLoadingProgress(0)
      setLoadingStage(0)
      setShowStories(false)

      // Start the loading animation
      let progress = 0
      let stage = 0

      loadingInterval.current = setInterval(() => {
        progress += Math.random() * 2

        if (progress >= 100) {
          progress = 100
          if (loadingInterval.current) {
            clearInterval(loadingInterval.current)
          }
        } else if (progress > (stage + 1) * (100 / loadingStages.length)) {
          stage = Math.min(stage + 1, loadingStages.length - 1)
          setLoadingStage(stage)
        }

        setLoadingProgress(progress)
      }, 150)

      try {
        const data = await fetchGitHubUserData(username)

        // Ensure the loading animation has time to complete
        setTimeout(() => {
          setUserData(data)
          setLoading(false)

          // Add a slight delay before showing stories for a smooth transition
          setTimeout(() => {
            setShowStories(true)
          }, 300)

          if (loadingInterval.current) {
            clearInterval(loadingInterval.current)
          }
        }, 2000) // Minimum loading time for better UX
      } catch (err) {
        if (loadingInterval.current) {
          clearInterval(loadingInterval.current)
        }
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        setUserData(null)
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      if (loadingInterval.current) {
        clearInterval(loadingInterval.current)
      }
    }
  }, [username])

  if (!username) {
    return (
      <div className="max-w-md mx-auto terminal-card overflow-hidden">
        <div className="terminal-header">
          <div className="terminal-circle red"></div>
          <div className="terminal-circle yellow"></div>
          <div className="terminal-circle green"></div>
          <span className="ml-2 text-sm text-muted-foreground">welcome.js</span>
        </div>
        <div className="terminal-body p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Github className="mr-2 h-6 w-6" />
            Welcome to GitHub Stories
          </h2>
          {isAuthenticated ? (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-900 rounded-lg">
              <p className="text-green-400">
                You're logged in with GitHub! Now you can access more detailed information.
              </p>
            </div>
          ) : null}
          <div className="code-block mt-4">
            <div className="code-line">
              <span className="code-line-number">1</span>
              <span className="keyword">function</span> <span className="function">getStarted</span>() {"{"}
            </div>
            <div className="code-line">
              <span className="code-line-number">2</span>
              &nbsp;&nbsp;<span className="keyword">const</span> username ={" "}
              <span className="string">"Your GitHub Username"</span>;
            </div>
            <div className="code-line">
              <span className="code-line-number">3</span>
              &nbsp;&nbsp;<span className="comment">// Search above to see your GitHub stories</span>
            </div>
            <div className="code-line">
              <span className="code-line-number">4</span>
              &nbsp;&nbsp;<span className="keyword">return</span>{" "}
              <span className="string">"Amazing GitHub insights!"</span>;
            </div>
            <div className="code-line">
              <span className="code-line-number">5</span>
              {"}"}
            </div>
          </div>
          <p className="text-sm mt-6 text-muted-foreground">
            Search for a GitHub username above to see their story, or login with your GitHub account.
            <br />
            <span className="text-green-500 mt-2 block">
              Celebrating Shamsi New Year with developer statistics and achievements!
            </span>
          </p>
        </div>
      </div>
    )
  }

  // Common container styles for consistent sizing
  const containerClasses = "w-full h-[100vh] max-h-[900px] mx-auto overflow-hidden"

  if (loading) {
    return (
      <motion.div
        className={`terminal-card ${containerClasses}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
            type: "spring",
            stiffness: 100,
            damping: 20,
          },
        }}
        layout
      >
        <motion.div
          className="terminal-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="terminal-circle red"></div>
          <div className="terminal-circle yellow"></div>
          <div className="terminal-circle green"></div>
          <span className="ml-2 text-sm text-muted-foreground">loading-stories.js</span>
        </motion.div>

        <motion.div
          className="flex flex-col justify-center items-center h-[calc(100%-38px)] p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.6,
            }}
            className="mb-6"
          >
            <Terminal className="h-12 w-12 text-primary" />
          </motion.div>

          <motion.div
            className="w-full max-w-md mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Loading {username}'s data</span>
              <span>{Math.round(loadingProgress)}%</span>
            </div>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.div
              key={loadingStage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-6"
            >
              <p className="text-primary flex items-center justify-center">
                <Code className="w-4 h-4 mr-2" />
                {loadingStages[loadingStage]}
              </p>
            </motion.div>

            <motion.div
              className="code-block mt-6 text-left max-w-md w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="code-line">
                <span className="code-line-number">1</span>
                <span className="keyword">async function</span> <span className="function">loadGitHubStories</span>
                {"(username) {"}
              </div>
              <div className="code-line">
                <span className="code-line-number">2</span>
                &nbsp;&nbsp;<span className="keyword">const</span> data = <span className="keyword">await</span>{" "}
                <span className="function">fetchGitHubData</span>
                {"(username)"}
              </div>
              <div className="code-line">
                <span className="code-line-number">3</span>
                &nbsp;&nbsp;<span className="comment">// Preparing visualization...</span>
              </div>
              <div className="code-line">
                <span className="code-line-number">4</span>
                &nbsp;&nbsp;<span className="keyword">return</span> <span className="function">renderStories</span>
                {"(data)"}
              </div>
              <div className="code-line">
                <span className="code-line-number">5</span>
                {"}"}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!userData) {
    return null
  }

  if (showBadge) {
    return (
      <motion.div
        className={`terminal-card ${containerClasses}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        layout
      >
        <div className="terminal-header">
          <div className="terminal-circle red"></div>
          <div className="terminal-circle yellow"></div>
          <div className="terminal-circle green"></div>
          <span className="ml-2 text-sm text-muted-foreground">badge.js</span>
        </div>
        <div className="p-6 flex flex-col items-center justify-center h-[calc(100%-38px)]">
          <PerformanceBadge score={userData.performanceScore} username={username} />
          <motion.button
            onClick={() => setShowBadge(false)}
            className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Stories
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className={containerClasses}>
      <AnimatePresence mode="wait">
        {showStories && (
          <motion.div
            key="stories-view"
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={{ opacity: 0 }}
            layout
          >
            <StoryView userData={userData} onComplete={() => setShowBadge(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

