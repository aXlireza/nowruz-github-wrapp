"use client"

import { motion } from "framer-motion"
import type { UserData } from "@/lib/github-service"
import { formatDistanceToNow } from "date-fns"
import { Users, Calendar, GitFork, Github, Star } from "lucide-react"

interface ProfileStoryProps {
  userData: UserData
}

export function ProfileStory({ userData }: ProfileStoryProps) {
  const { profile } = userData

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    show: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div
      className="h-full w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-black shamsi-pattern"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div className="absolute top-20 left-10 opacity-30" variants={floatingVariants} animate="animate">
        <Github className="w-16 h-16 text-primary/20" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 right-10 opacity-30"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <Star className="w-12 h-12 text-yellow-500/20" />
      </motion.div>

      <motion.div variants={itemVariants} className="relative">
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
          variants={pulseVariants}
          animate="animate"
        />
        <motion.div
          className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary mb-6 glow-effect relative z-10"
          variants={iconVariants}
        >
          <img
            src={profile.avatarUrl || "/placeholder.svg"}
            alt={profile.login}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="text-3xl font-bold mb-2 text-center bg-gradient-to-r from-primary to-white text-transparent bg-clip-text"
      >
        {profile.name || profile.login}
      </motion.h2>

      <motion.p variants={itemVariants} className="text-lg text-white/80 mb-6 text-center">
        {profile.bio || "GitHub Developer"}
      </motion.p>

      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 w-full max-w-xs">
        <motion.div
          className="flex flex-col items-center bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-gray-800"
          whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <motion.div variants={iconVariants}>
            <Users className="w-5 h-5 mb-1 text-primary" />
          </motion.div>
          <motion.span
            className="text-xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                delay: 0.6,
                duration: 0.5,
                type: "spring",
              },
            }}
          >
            {profile.followers}
          </motion.span>
          <span className="text-xs">Followers</span>
        </motion.div>

        <motion.div
          className="flex flex-col items-center bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-gray-800"
          whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <motion.div variants={iconVariants}>
            <Users className="w-5 h-5 mb-1 text-primary" />
          </motion.div>
          <motion.span
            className="text-xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                delay: 0.7,
                duration: 0.5,
                type: "spring",
              },
            }}
          >
            {profile.following}
          </motion.span>
          <span className="text-xs">Following</span>
        </motion.div>

        <motion.div
          className="flex flex-col items-center bg-black/20 backdrop-blur-sm rounded-lg p-3 border border-gray-800"
          whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <motion.div variants={iconVariants}>
            <GitFork className="w-5 h-5 mb-1 text-primary" />
          </motion.div>
          <motion.span
            className="text-xl font-bold"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                delay: 0.8,
                duration: 0.5,
                type: "spring",
              },
            }}
          >
            {profile.publicRepos}
          </motion.span>
          <span className="text-xs">Repos</span>
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-6 flex items-center text-white/80">
        <Calendar className="w-4 h-4 mr-2" />
        <span>Member since {formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true })}</span>
      </motion.div>
    </motion.div>
  )
}

