"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { UserData } from "@/lib/github-service"
import { ProfileStory } from "@/components/stories/profile-story"
import { RepositoriesStory } from "@/components/stories/repositories-story"
import { ActivityStory } from "@/components/stories/activity-story"
import { ContributionsStory } from "@/components/stories/contributions-story"
import { LanguagesStory } from "@/components/stories/languages-story"
import { SeasonalContributionsStory } from "@/components/stories/seasonal-contributions-story"
import { X, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

interface StoryViewProps {
  userData: UserData
  onComplete: () => void
}

export function StoryView({ userData, onComplete }: StoryViewProps) {
  const [currentStory, setCurrentStory] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [progressBarsVisible, setProgressBarsVisible] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(false)
  const [isContentReady, setIsContentReady] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const completeTriggeredRef = useRef(false)
  const goToNextStoryRef = useRef<() => void>(() => {})

  const stories = useRef([
    { component: ProfileStory, duration: 5000 },
    { component: RepositoriesStory, duration: 7000 },
    { component: ActivityStory, duration: 6000 },
    { component: ContributionsStory, duration: 5000 },
    { component: LanguagesStory, duration: 5000 },
    { component: SeasonalContributionsStory, duration: 6000 },
  ]).current

  const resetInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (!isPaused && !isInitialLoad) {
      const duration = stories[currentStory].duration
      const increment = 100 / (duration / 100) // Progress increment per 100ms

      setProgress(0)

      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Use the ref to avoid circular dependency
            setTimeout(() => goToNextStoryRef.current(), 0)
            return 0
          }
          return prev + increment
        })
      }, 100)
    }
  }, [currentStory, isPaused, isInitialLoad])

  // Define goToNextStory first, using a ref to break circular dependency
  const goToNextStory = useCallback(() => {
    if (currentStory < stories.length - 1) {
      setDirection(1)
      setCurrentStory((prev) => prev + 1)
    } else {
      // Complete the stories - use ref to prevent multiple calls
      if (!completeTriggeredRef.current) {
        completeTriggeredRef.current = true
        if (intervalRef.current) clearInterval(intervalRef.current)
        onComplete()
      }
    }
  }, [currentStory, stories.length, onComplete])

  // Update the ref whenever goToNextStory changes
  useEffect(() => {
    goToNextStoryRef.current = goToNextStory
  }, [goToNextStory])

  const goToPreviousStory = useCallback(() => {
    if (currentStory > 0) {
      setDirection(-1)
      setCurrentStory((prev) => prev - 1)
    }
  }, [currentStory])

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  useEffect(() => {
    resetInterval()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentStory, isPaused, isInitialLoad, resetInterval])

  // Handle initial loading sequence with improved transitions
  useEffect(() => {
    if (isInitialLoad) {
      // Sequence the appearance of UI elements with smoother timing
      const sequence = async () => {
        // Preload content first
        setTimeout(() => {
          setIsContentReady(true)

          // Then show the progress bars
          setTimeout(() => {
            setProgressBarsVisible(true)

            // Then show the header
            setTimeout(() => {
              setHeaderVisible(true)

              // Then show the controls
              setTimeout(() => {
                setControlsVisible(true)

                // Finally start the progress
                setTimeout(() => {
                  setIsInitialLoad(false)
                }, 400)
              }, 300)
            }, 300)
          }, 300)
        }, 500)
      }

      sequence()
    }
  }, [isInitialLoad])

  // Improved animation variants with smoother transitions
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.9,
      }
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 250, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4, ease: "easeOut" },
      },
    },
    exit: (direction: number) => {
      return {
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.9,
        transition: {
          x: { type: "spring", stiffness: 250, damping: 30 },
          opacity: { duration: 0.4 },
          scale: { duration: 0.3 },
        },
      }
    },
  }

  const CurrentStoryComponent = stories[currentStory].component
  return (
    <motion.div
      className="w-full h-full relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-br from-gray-900 to-black text-white border border-gray-800"
      initial={{
        opacity: 0,
        scale: 0.95,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Preload content with fade-in */}
      <AnimatePresence>
        {isContentReady && (
          <motion.div
            className="absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Progress bars with sequential loading animation */}
            <AnimatePresence>
              {progressBarsVisible && (
                <motion.div
                  className="absolute bg-black/80 top-0 left-0 right-0 z-20 flex p-2 gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {stories.map((_, index) => (
                    <motion.div
                      key={index}
                      className="story-progress flex-1"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{
                        opacity: 1,
                        width: "auto",
                        transition: {
                          delay: 0.05 * index,
                          duration: 0.3,
                        },
                      }}
                    >
                      <motion.div
                        className="story-progress-inner bg-slate-200 h-full rounded-[3px]"
                        initial={{ width: "0%" }}
                        animate={{
                          width:
                            index < currentStory
                              ? "100%"
                              : index === currentStory
                                ? isInitialLoad
                                  ? "0%"
                                  : `${progress}%`
                                : "0%",
                        }}
                        transition={{
                          duration: index === currentStory ? 0.1 : 0.5,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header with fade-in animation */}
            <AnimatePresence>
              {headerVisible && (
                <motion.div
                  className="absolute top-3 left-0 right-0 z-20 flex justify-between items-center p-4 pt-6 bg-gradient-to-b from-black/80 via-black/50 to-transparent"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center">
                    <motion.div
                      className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                    >
                      <Image
                        src={userData.profile.avatarUrl || "/placeholder.svg"}
                        alt={userData.profile.login}
                        width={40}
                        height={40}
                      />
                    </motion.div>
                    <motion.div
                      className="ml-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <p className="font-bold">{userData.profile.login}</p>
                      <p className="text-xs text-gray-300">{new Date().toLocaleDateString()}</p>
                    </motion.div>
                  </div>
                  <motion.button
                    onClick={togglePause}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    {isPaused ? <Play size={16} /> : <Pause size={16} />}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Story content with AnimatePresence for smooth transitions */}
            <div className="h-full w-full">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentStory}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="h-full w-full absolute inset-0"
                >
                  <CurrentStoryComponent userData={userData} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation controls with fade-in animation */}
            <AnimatePresence>
              {controlsVisible && (
                <>
                  <motion.button
                    onClick={goToPreviousStory}
                    disabled={currentStory === 0}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center disabled:opacity-0 z-10 hover:bg-black/60 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: currentStory === 0 ? 0 : 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                  >
                    <ChevronLeft size={24} />
                  </motion.button>

                  <motion.button
                    onClick={goToNextStory}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 flex items-center justify-center z-10 hover:bg-black/60 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                  >
                    <ChevronRight size={24} />
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      if (intervalRef.current) {
                        clearInterval(intervalRef.current)
                      }
                      onComplete()
                    }}
                    className="absolute top-1 right-4 z-30 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center hover:bg-black/60 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.9, duration: 0.3 }}
                  >
                    <X size={18} />
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initial loading state */}
      <AnimatePresence>
        {!isContentReady && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

