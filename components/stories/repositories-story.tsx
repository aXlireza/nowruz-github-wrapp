"use client"

import { motion } from "framer-motion"
import type { UserData } from "@/lib/github-service"
import { formatDistanceToNow } from "date-fns"
import { Star, GitFork, Code, BookOpen } from "lucide-react"

interface RepositoriesStoryProps {
  userData: UserData
}

export function RepositoriesStory({ userData }: RepositoriesStoryProps) {
  const { topRepositories } = userData

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

  const floatingIconVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 10, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  }

  return (
    <motion.div
      className="h-full w-full flex flex-col p-6 bg-gradient-to-br from-blue-900 to-gray-900 shamsi-pattern relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Floating background elements */}
      <motion.div className="absolute top-10 right-10 opacity-20" variants={floatingIconVariants} animate="animate">
        <BookOpen className="w-20 h-20 text-blue-400" />
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-10 opacity-20"
        variants={floatingIconVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <GitFork className="w-16 h-16 text-primary" />
      </motion.div>

      <motion.h2 variants={headerVariants} className="text-2xl font-bold mb-6 text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-block mr-2"
        >
          <BookOpen className="w-6 h-6 inline-block mr-2 text-blue-400" />
        </motion.span>
        Top Repositories
      </motion.h2>

      <div className="flex-1 overflow-y-auto space-y-4 relative z-10">
        {topRepositories.map((repo, index) => (
          <motion.div
            key={repo.id}
            initial={{ x: -100, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              transition: {
                delay: 0.2 + index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 20,
              },
            }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.5)",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
            className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800 transition-all duration-300"
          >
            <motion.h3
              className="font-bold text-lg mb-1"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 0.3 + index * 0.1 },
              }}
            >
              {repo.name}
            </motion.h3>

            {repo.description && (
              <motion.p
                className="text-sm text-white/80 mb-3 line-clamp-2"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.4 + index * 0.1 },
                }}
              >
                {repo.description}
              </motion.p>
            )}

            <motion.div
              className="flex items-center justify-between text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.5 + index * 0.1 },
              }}
            >
              <div className="flex items-center space-x-3">
                {repo.language && (
                  <motion.div className="flex items-center" whileHover={{ scale: 1.1 }}>
                    <Code className="w-4 h-4 mr-1 text-primary" />
                    <span>{repo.language}</span>
                  </motion.div>
                )}

                <motion.div className="flex items-center" whileHover={{ scale: 1.1 }}>
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: {
                        delay: 0.6 + index * 0.1,
                        duration: 0.5,
                      },
                    }}
                  >
                    {repo.stargazersCount}
                  </motion.span>
                </motion.div>

                <motion.div className="flex items-center" whileHover={{ scale: 1.1 }}>
                  <GitFork className="w-4 h-4 mr-1 text-blue-400" />
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: {
                        delay: 0.7 + index * 0.1,
                        duration: 0.5,
                      },
                    }}
                  >
                    {repo.forksCount}
                  </motion.span>
                </motion.div>
              </div>

              <div className="text-xs text-white/70">
                {formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

