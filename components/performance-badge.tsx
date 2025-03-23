"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Award, Download, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { confetti } from "@/lib/confetti"

interface PerformanceBadgeProps {
  score: number
  username: string
}

export function PerformanceBadge({ score, username }: PerformanceBadgeProps) {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)

      // Trigger confetti when badge is shown
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.3 },
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [score, username])

  const getScoreCategory = () => {
    if (score >= 90) return "Exceptional"
    if (score >= 75) return "Outstanding"
    if (score >= 60) return "Excellent"
    if (score >= 40) return "Good"
    return "Promising"
  }

  const getScoreColor = () => {
    if (score >= 90) return "from-[#39D353] to-[#26A641]"
    if (score >= 75) return "from-[#26A641] to-[#006D32]"
    if (score >= 60) return "from-[#40C463] to-[#2EA043]"
    if (score >= 40) return "from-[#9BE9A8] to-[#40C463]"
    return "from-[#AEFF14] to-[#9BE9A8]"
  }

  const downloadBadge = () => {
    // In a real app, this would generate and download an image
    alert("In a real app, this would download an image of your badge.")

    // Trigger confetti again on download
    confetti({
      particleCount: 100,
      spread: 120,
      origin: { y: 0.6 },
    })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  const sparkleVariants = {
    animate: (i: number) => ({
      opacity: [0.2, 1, 0.2],
      scale: [0.8, 1.2, 0.8],
      rotate: [0, 15, 0],
      transition: {
        duration: 2 + i * 0.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
        delay: i * 0.3,
      },
    }),
  }

  const floatingStarVariants = {
    animate: (i: number) => ({
      y: [0, -15 - i * 5, 0],
      x: [0, i * 3, 0],
      rotate: [0, i * 10, 0],
      transition: {
        duration: 3 + i,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
        delay: i * 0.2,
      },
    }),
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full relative"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Floating stars */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${20 + i * 5}%`,
            left: `${20 + i * 15}%`,
            zIndex: 1,
          }}
          custom={i}
          variants={floatingStarVariants}
          animate="animate"
        >
          <Star className={`w-${3 + i} h-${3 + i} text-yellow-400/40`} />
        </motion.div>
      ))}

      {/* Sparkles around badge */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${50 + 30 * Math.sin((i * Math.PI) / 4)}%`,
            left: `${50 + 30 * Math.cos((i * Math.PI) / 4)}%`,
            zIndex: 1,
          }}
          custom={i}
          variants={sparkleVariants}
          animate="animate"
        >
          <Sparkles className="w-5 h-5 text-primary/30" />
        </motion.div>
      ))}

      <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-8 text-center flex items-center">
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
        >
          <Award className="mr-2 h-8 w-8 text-primary" />
        </motion.span>
        GitHub Performance Badge
      </motion.h2>

      <motion.div className="badge-container" variants={itemVariants} style={{ width: "250px", height: "250px" }}>
        <motion.div
          className="badge-border"
          initial={{ opacity: 0, rotate: -90 }}
          animate={{
            opacity: 1,
            rotate: 0,
            transition: {
              delay: 0.4,
              duration: 1,
              ease: "easeOut",
            },
          }}
        />
        <motion.div
          className={`badge-inner bg-gradient-to-br ${getScoreColor()}`}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: isAnimating ? [0.5, 1.1, 1] : 1,
            opacity: 1,
          }}
          transition={{
            duration: isAnimating ? 1.5 : 0,
            times: [0, 0.8, 1],
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.6,
              duration: 0.5,
              type: "spring",
              stiffness: 200,
            }}
          >
            <Award className="w-16 h-16 text-white mb-4" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center"
          >
            <motion.p
              className="text-white text-sm mb-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.3 }}
            >
              PERFORMANCE
            </motion.p>
            <motion.p
              className="text-white text-5xl font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 1,
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              }}
            >
              {score}
            </motion.p>
            <motion.p
              className="text-white text-lg mt-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.3 }}
            >
              {getScoreCategory()}
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div className="mt-8 text-center" variants={itemVariants}>
        <motion.p
          className="mb-6 text-white/80 text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          {username}, you're among the {getScoreCategory().toLowerCase()} GitHub developers!
          <br />
          <motion.span
            className="text-primary text-lg inline-block mt-2"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: [1, 1.1, 1],
              transition: {
                delay: 1.3,
                duration: 0.5,
                times: [0, 0.5, 1],
              },
            }}
          >
            Happy Shamsi New Year 1403! 🎉
          </motion.span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={downloadBadge}
            className="flex items-center text-lg px-6 py-6"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Badge
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

