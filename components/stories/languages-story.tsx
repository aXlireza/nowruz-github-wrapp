"use client"

import { motion } from "framer-motion"
import type { UserData } from "@/lib/github-service"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { Code, Sparkles } from "lucide-react"

interface LanguagesStoryProps {
  userData: UserData
}

export function LanguagesStory({ userData }: LanguagesStoryProps) {
  const { languages } = userData

  // Enhanced vibrant color palette
  const COLORS = [
    "#22c55e", // Pink
    "#901717", // Purple
    "#4fc3f7", // Lavender
    "#8795E8", // Periwinkle
    "#94D0FF", // Light Blue
    "#4CB8FF", // Blue
    "#43E8D8", // Teal
    "#3BF4FB", // Cyan
    "#0AEFFF", // Bright Cyan
    "#19FB9B", // Mint
  ]

  const languageData = Object.entries(languages).map(([name, count], index) => ({
    name,
    value: count,
    color: COLORS[index % COLORS.length],
  }))

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

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.4,
        duration: 0.8,
        type: "spring",
        stiffness: 100,
        damping: 20,
      },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  }

  const sparkleVariants = {
    animate: (i: number) => ({
      opacity: [0.2, 1, 0.2],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 2 + i * 0.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
        delay: i * 0.3,
      },
    }),
  }

  return (
    <motion.div
      className="h-full w-full flex flex-col bg-gradient-to-br from-gray-900 via-purple-900/20 to-black shamsi-pattern relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Background animated elements */}
      <motion.div className="absolute top-10 right-10 opacity-20" variants={floatingVariants} animate="animate">
        <Code className="w-20 h-20 text-purple-400" />
      </motion.div>

      {/* Sparkles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 18}%`,
            zIndex: 1,
          }}
          custom={i}
          variants={sparkleVariants}
          animate="animate"
        >
          <Sparkles className={`w-${4 + i} h-${4 + i} text-purple-400/40`} />
        </motion.div>
      ))}

      <motion.div variants={headerVariants} className="mb-6 text-center relative z-10">
        <motion.h2
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
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
            <Code className="w-6 h-6 inline-block mr-2 text-purple-400" />
          </motion.span>
          Programming Languages
        </motion.h2>
        <motion.p
          className="text-xs text-white/60 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.span
            className="text-purple-400"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.6,
              duration: 0.5,
              type: "spring",
            }}
          >
            Happy Shamsi New Year!
          </motion.span>{" "}
          Here's your language breakdown
        </motion.p>
      </motion.div>

      <motion.div variants={chartVariants} className="flex-1 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              delay: 0.5,
              duration: 0.5,
            },
          }}
          className="absolute inset-0 bg-black/10 rounded-lg backdrop-blur-sm"
        />

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {/* Add glow filter for pie chart */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Add individual gradients for each language */}
              {COLORS.map((color, index) => (
                <linearGradient key={index} id={`colorGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color.replace("FF", "99")} stopOpacity={0.8} />
                </linearGradient>
              ))}
            </defs>

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
                padding: "8px 12px",
              }}
              formatter={(value: number, name: string) => [`${value} projects`, name]}
            />

            <Pie
              data={languageData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={{ stroke: "rgba(255, 255, 255, 0.3)", strokeWidth: 1 }}
              animationDuration={2000}
              animationEasing="ease-in-out"
              filter="url(#glow)"
            >
              {languageData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#colorGradient-${index % COLORS.length})`}
                  stroke="rgba(0, 0, 0, 0.3)"
                  strokeWidth={1}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Language legend with animations */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm p-3 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex flex-wrap justify-center gap-3">
            {languageData.slice(0, 5).map((language, index) => (
              <motion.div
                key={index}
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className="w-3 h-3 rounded-full mr-1"
                  style={{
                    background: `linear-gradient(135deg, ${language.color}, ${language.color.replace("FF", "99")})`,
                    boxShadow: `0 0 8px ${language.color}80`,
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
                />
                <span className="text-xs">{language.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

