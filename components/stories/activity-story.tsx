"use client"

import { motion } from "framer-motion"
import type { UserData } from "@/lib/github-service"
import { formatDistanceToNow } from "date-fns"
import { GitCommit, GitPullRequest, Star, GitMerge, GitBranch, Activity } from "lucide-react"

interface ActivityStoryProps {
  userData: UserData
}

export function ActivityStory({ userData }: ActivityStoryProps) {
  const { recentActivity } = userData

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "PushEvent":
        return <GitCommit className="w-5 h-5 text-green-400" />
      case "PullRequestEvent":
        return <GitPullRequest className="w-5 h-5 text-purple-400" />
      case "WatchEvent":
        return <Star className="w-5 h-5 text-yellow-400" />
      case "CreateEvent":
        return <GitBranch className="w-5 h-5 text-blue-400" />
      case "MergeEvent":
        return <GitMerge className="w-5 h-5 text-teal-400" />
      default:
        return <GitCommit className="w-5 h-5 text-green-400" />
    }
  }

  const getActivityText = (activity: any) => {
    const repoName = activity.repo.name.split("/")[1]

    switch (activity.type) {
      case "PushEvent":
        return `Pushed commits to ${repoName}`
      case "PullRequestEvent":
        return `Created a pull request for ${repoName}`
      case "WatchEvent":
        return `Starred repository ${repoName}`
      case "CreateEvent":
        return `Created ${activity.payload?.ref_type || "branch"} in ${repoName}`
      default:
        return `Activity in ${repoName}`
    }
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

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
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

  const waveVariants = {
    animate: {
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.1, 1],
      transition: {
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div
      className="h-full w-full flex flex-col p-6 bg-gradient-to-br from-purple-900 to-gray-900 shamsi-pattern relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Background animated elements */}
      <motion.div
        className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-20 right-20 w-40 h-40 rounded-full bg-purple-600/10 blur-3xl"
          variants={waveVariants}
          animate="animate"
        />
        <motion.div
          className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-blue-600/10 blur-3xl"
          variants={waveVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
      </motion.div>

      <motion.div className="absolute top-10 right-10 opacity-20" variants={pulseVariants} animate="animate">
        <Activity className="w-16 h-16 text-purple-400" />
      </motion.div>

      <motion.h2 variants={headerVariants} className="text-2xl font-bold mb-6 text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
          className="inline-block mr-2"
        >
          <Activity className="w-6 h-6 inline-block mr-2 text-purple-400" />
        </motion.span>
        Recent Activity
      </motion.h2>

      <div className="flex-1 overflow-y-auto relative z-10">
        {recentActivity.map((activity, index) => (
          <motion.div
            key={index}
            initial={{
              x: 100,
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              x: 0,
              opacity: 1,
              scale: 1,
              transition: {
                delay: 0.2 + index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 20,
              },
            }}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              transition: { duration: 0.2 },
            }}
            className="flex items-center mb-4 p-3 rounded-lg border border-transparent hover:border-gray-700"
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center mr-3 border border-gray-800"
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: 1,
                rotate: 0,
                transition: {
                  delay: 0.3 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                },
              }}
              whileHover={{
                scale: 1.2,
                rotate: 15,
                transition: { duration: 0.2 },
              }}
            >
              {getActivityIcon(activity.type)}
            </motion.div>

            <div className="flex-1">
              <motion.p
                className="font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.4 + index * 0.1,
                    duration: 0.3,
                  },
                }}
              >
                {getActivityText(activity)}
              </motion.p>
              <motion.p
                className="text-sm text-white/70"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: {
                    delay: 0.5 + index * 0.1,
                    duration: 0.3,
                  },
                }}
              >
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

