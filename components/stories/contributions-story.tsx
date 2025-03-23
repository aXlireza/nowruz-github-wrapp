"use client"

import { motion } from "framer-motion"
import type { UserData } from "@/lib/github-service"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"
import { TrendingUp, Calendar, Award } from "lucide-react"

interface ContributionsStoryProps {
  userData: UserData
}

export function ContributionsStory({ userData }: ContributionsStoryProps) {
  const { contributionsLastYear } = userData

  // Group contributions by month
  const monthlyContributions = contributionsLastYear.reduce(
    (acc, curr) => {
      const date = new Date(curr.date)
      const month = date.toLocaleString("en-US", { month: "short" })

      if (!acc[month]) {
        acc[month] = 0
      }

      acc[month] += curr.count
      return acc
    },
    {} as Record<string, number>,
  )

  const chartData = Object.entries(monthlyContributions).map(([month, count]) => ({
    month,
    count,
  }))

  const totalContributions = contributionsLastYear.reduce((sum, day) => sum + day.count, 0)
  const maxDailyContribution = Math.max(...contributionsLastYear.map((day) => day.count))
  const averageDailyContribution = totalContributions / contributionsLastYear.length

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

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.9 },
    show: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  const chartVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6,
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
      className="h-full w-full flex flex-col p-6 bg-gradient-to-br from-green-900 to-gray-900 shamsi-pattern relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Background animated elements */}
      <motion.div className="absolute top-10 right-10 opacity-20" variants={floatingVariants} animate="animate">
        <TrendingUp className="w-20 h-20 text-green-400" />
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-10 opacity-20"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <Calendar className="w-16 h-16 text-green-300" />
      </motion.div>

      <motion.h2 variants={headerVariants} className="text-2xl font-bold mb-4 text-center relative z-10">
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
          <TrendingUp className="w-6 h-6 inline-block mr-2 text-green-400" />
        </motion.span>
        Your Contributions
      </motion.h2>

      <motion.div variants={containerVariants} className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          className="bg-black/30 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-800"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            transition: { duration: 0.2 },
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <Award className="w-5 h-5 mx-auto mb-1 text-green-400" />
          </motion.div>
          <p className="text-xs mb-1">Total</p>
          <motion.p
            className="text-2xl font-bold text-primary"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                delay: 0.5,
                duration: 0.5,
                type: "spring",
              },
            }}
          >
            {totalContributions}
          </motion.p>
        </motion.div>

        <motion.div
          className="bg-black/30 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-800"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            transition: { duration: 0.2 },
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <Award className="w-5 h-5 mx-auto mb-1 text-green-400" />
          </motion.div>
          <p className="text-xs mb-1">Max Daily</p>
          <motion.p
            className="text-2xl font-bold text-primary"
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
            {maxDailyContribution}
          </motion.p>
        </motion.div>

        <motion.div
          className="bg-black/30 backdrop-blur-sm rounded-lg p-3 text-center border border-gray-800"
          variants={itemVariants}
          whileHover={{
            scale: 1.05,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            transition: { duration: 0.2 },
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          >
            <Award className="w-5 h-5 mx-auto mb-1 text-green-400" />
          </motion.div>
          <p className="text-xs mb-1">Daily Average</p>
          <motion.p
            className="text-2xl font-bold text-primary"
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
            {averageDailyContribution.toFixed(1)}
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.div variants={chartVariants} className="flex-1 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              delay: 0.8,
              duration: 0.5,
            },
          }}
          className="absolute inset-0 bg-black/10 rounded-lg backdrop-blur-sm"
        />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <defs>
              {/* Gradient that starts from the line and fades to transparent */}
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.7} />
                <stop offset="40%" stopColor="#22c55e" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" stroke="#ffffff" tick={{ fill: "#ffffff" }} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#ffffff"
              tick={{ fill: "#ffffff" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "1px solid rgba(100, 100, 100, 0.3)",
                borderRadius: "8px",
                color: "white",
              }}
              formatter={(value: number) => [`${value} contributions`, ""]}
              labelFormatter={(label) => `Month: ${label}`}
              cursor={{ stroke: "rgba(150, 150, 150, 0.2)", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
              animationDuration={2000}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  )
}

