"use client"

import { motion, AnimatePresence } from "framer-motion"
import type { UserData } from "@/lib/github-service"
import { Sun, Cloud, Leaf, Snowflake } from "lucide-react"
import { NowruzCharacter } from "@/components/nowruz-character"
import { useState } from "react"

interface SeasonalContributionsStoryProps {
  userData: UserData
}

export function SeasonalContributionsStory({ userData }: SeasonalContributionsStoryProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number; month: string; season: string } | null>(
    null,
  )

  // Jalali seasons
  const seasons = [
    {
      name: "Spring",
      months: ["Farvardin", "Ordibehesht", "Khordad"],
      icon: <Sun className="w-6 h-6 text-yellow-400" />,
      color: "from-green-400 to-green-600",
      character: "sabzeh" as const,
      mood: "celebrate" as const,
      baseColor: "green",
    },
    {
      name: "Summer",
      months: ["Tir", "Mordad", "Shahrivar"],
      icon: <Sun className="w-6 h-6 text-orange-400" />,
      color: "from-orange-400 to-orange-600",
      character: "fire" as const,
      mood: "excited" as const,
      baseColor: "orange",
    },
    {
      name: "Fall",
      months: ["Mehr", "Aban", "Azar"],
      icon: <Leaf className="w-6 h-6 text-amber-400" />,
      color: "from-amber-400 to-amber-600",
      character: "goldfish" as const,
      mood: "dance" as const,
      baseColor: "amber",
    },
    {
      name: "Winter",
      months: ["Dey", "Bahman", "Esfand"],
      icon: <Snowflake className="w-6 h-6 text-blue-400" />,
      color: "from-blue-400 to-blue-600",
      character: "hajiFiruz" as const,
      mood: "happy" as const,
      baseColor: "blue",
    },
  ]

  // Mock data for contributions by month
  // In a real app, this would come from the GitHub API
  const contributionsByMonth = {
    Farvardin: 32,
    Ordibehesht: 41,
    Khordad: 37,
    Tir: 28,
    Mordad: 45,
    Shahrivar: 53,
    Mehr: 39,
    Aban: 42,
    Azar: 35,
    Dey: 26,
    Bahman: 18,
    Esfand: 27,
  }

  // Generate mock daily contributions data for the heat map
  // In a real app, this would come from the GitHub API
  const generateDailyContributions = () => {
    const contributions = []
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 364) // Go back ~1 year

    // Generate a contribution for each day
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      // Determine which month/season this date belongs to
      // For simplicity, we'll just assign it based on the position in the year
      let month
      let season
      let seasonObj

      if (i < 91) {
        // First quarter - Spring
        month = ["Farvardin", "Ordibehesht", "Khordad"][Math.floor(i / 30)]
        season = "Spring"
        seasonObj = seasons[0]
      } else if (i < 182) {
        // Second quarter - Summer
        month = ["Tir", "Mordad", "Shahrivar"][Math.floor((i - 91) / 30)]
        season = "Summer"
        seasonObj = seasons[1]
      } else if (i < 273) {
        // Third quarter - Fall
        month = ["Mehr", "Aban", "Azar"][Math.floor((i - 182) / 30)]
        season = "Fall"
        seasonObj = seasons[2]
      } else {
        // Fourth quarter - Winter
        month = ["Dey", "Bahman", "Esfand"][Math.floor((i - 273) / 30)]
        season = "Winter"
        seasonObj = seasons[3]
      }

      // Base contribution count on the month's total, but add some randomness
      const baseCount = contributionsByMonth[month] || 30
      const dayOfWeek = date.getDay()

      // Make weekends have fewer contributions on average
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const maxForDay = isWeekend ? (baseCount / 30) * 2 : (baseCount / 30) * 5

      // Random count with some days having zero
      let count = Math.random() > 0.3 ? Math.floor(Math.random() * maxForDay) : 0

      // Add some "hot" days with more contributions
      if (Math.random() > 0.95) {
        count = Math.floor(Math.random() * 10) + 5
      }

      contributions.push({
        date: date.toISOString().split("T")[0],
        count,
        month,
        season,
        baseColor: seasonObj.baseColor,
      })
    }

    return contributions
  }

  const dailyContributions = generateDailyContributions()

  // Calculate total contributions by season
  const contributionsBySeason = seasons.map((season) => {
    const total = season.months.reduce((sum, month) => sum + (contributionsByMonth[month] || 0), 0)
    return {
      ...season,
      total,
    }
  })

  // Find the season with the most contributions
  const maxContributions = Math.max(...contributionsBySeason.map((s) => s.total))
  const mostActiveSeasonIndex = contributionsBySeason.findIndex((s) => s.total === maxContributions)

  // Get color for contribution count - with more subtle gradations
  const getContributionColor = (count: number, baseColor: string) => {
    if (count === 0) return "bg-gray-800"

    // Different color schemes for different seasons
    switch (baseColor) {
      case "green":
        if (count < 2) return "bg-green-900/40"
        if (count < 4) return "bg-green-700/60"
        if (count < 6) return "bg-green-600/80"
        return "bg-green-500"
      case "orange":
        if (count < 2) return "bg-orange-900/40"
        if (count < 4) return "bg-orange-700/60"
        if (count < 6) return "bg-orange-600/80"
        return "bg-orange-500"
      case "amber":
        if (count < 2) return "bg-amber-900/40"
        if (count < 4) return "bg-amber-700/60"
        if (count < 6) return "bg-amber-600/80"
        return "bg-amber-500"
      case "blue":
        if (count < 2) return "bg-blue-900/40"
        if (count < 4) return "bg-blue-700/60"
        if (count < 6) return "bg-blue-600/80"
        return "bg-blue-500"
      default:
        if (count < 2) return "bg-green-900/40"
        if (count < 4) return "bg-green-700/60"
        if (count < 6) return "bg-green-600/80"
        return "bg-green-500"
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

  // Group contributions by week for the heat map
  const contributionsByWeek = []
  for (let i = 0; i < 52; i++) {
    contributionsByWeek.push(dailyContributions.slice(i * 7, (i + 1) * 7))
  }

  return (
    <motion.div
      className="h-full w-full flex flex-col p-6 bg-gradient-to-br from-gray-900 to-black shamsi-pattern relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Background animated elements - more subtle */}
      <motion.div
        className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute top-20 right-20 w-40 h-40 rounded-full bg-green-600/5 blur-3xl"
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-blue-600/5 blur-3xl"
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 2,
          }}
        />
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
          <Cloud className="w-6 h-6 inline-block mr-2 text-blue-400" />
        </motion.span>
        Seasonal Contributions
      </motion.h2>

      {/* GitHub-style heat map with horizontal seasons layout */}
      <motion.div
        variants={itemVariants}
        className="mb-6 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-400">Less</div>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-gray-800"></div>
            <div className="w-3 h-3 rounded-sm bg-green-900/40"></div>
            <div className="w-3 h-3 rounded-sm bg-green-700/60"></div>
            <div className="w-3 h-3 rounded-sm bg-green-600/80"></div>
            <div className="w-3 h-3 rounded-sm bg-green-500"></div>
          </div>
          <div className="text-sm text-gray-400">More</div>
        </div>

        <div className="relative">
          {/* Heat map grid - horizontal layout */}
          <div className="overflow-x-auto">
            <div className="flex flex-row gap-4 min-w-[800px]">
              {/* Divide the heat map into 4 seasons horizontally */}
              {[0, 1, 2, 3].map((seasonIndex) => {
                // Get weeks for this season (roughly 13 weeks per season)
                const seasonWeeks = contributionsByWeek.slice(seasonIndex * 13, (seasonIndex + 1) * 13)
                const season = seasons[seasonIndex]

                return (
                  <div key={season.name} className="flex-1 relative">
                    {/* Season header */}
                    <div className="flex items-center gap-2 mb-3">
                      {season.icon}
                      <span className="text-sm font-medium">{season.name}</span>
                      <span className="text-xs text-gray-400 ml-auto">{season.total} contributions</span>
                    </div>

                    {/* Vertical season divider */}
                    {seasonIndex < 3 && (
                      <div className="absolute top-0 bottom-0 right-0 w-px bg-gray-700/50 translate-x-2"></div>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {seasonWeeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                          {week.map((day, dayIndex) => (
                            <motion.div
                              key={dayIndex}
                              className={`w-3 h-3 rounded-sm ${getContributionColor(day.count, day.baseColor)} cursor-pointer`}
                              whileHover={{ scale: 1.2 }}
                              onHoverStart={() => setHoveredDay(day)}
                              onHoverEnd={() => setHoveredDay(null)}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                                transition: {
                                  delay: 0.5 + weekIndex * 0.02 + dayIndex * 0.005,
                                  duration: 0.3,
                                },
                              }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tooltip for hovered day - improved positioning */}
          <AnimatePresence>
            {hoveredDay && (
              <motion.div
                className="absolute bg-black/80 text-white text-xs p-2 rounded pointer-events-none z-20 border border-gray-700"
                style={{
                  left: "50%",
                  bottom: "100%",
                  marginBottom: "8px",
                  transform: "translateX(-50%)",
                }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="font-bold">{hoveredDay.date}</div>
                <div>{hoveredDay.count} contributions</div>
                <div>
                  {hoveredDay.month} ({hoveredDay.season})
                </div>
                <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black/80 rotate-45 border-r border-b border-gray-700"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Season cards - now in a 2x2 grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {contributionsBySeason.map((season, index) => (
          <motion.div
            key={season.name}
            variants={itemVariants}
            className={`bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-gray-800 overflow-hidden relative ${
              index === mostActiveSeasonIndex ? "ring-2 ring-primary" : ""
            }`}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.5)",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Season header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center mr-3">
                  {season.icon}
                </div>
                <h3 className="text-xl font-bold">{season.name}</h3>
              </div>
              <div className="text-2xl font-bold text-primary">{season.total}</div>
            </div>

            {/* Month contributions */}
            <div className="space-y-3">
              {season.months.map((month) => {
                const count = contributionsByMonth[month] || 0
                const percentage = Math.round((count / 60) * 100) // Assuming max is 60 for visualization

                return (
                  <div key={month} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{month}</span>
                      <span>{count} contributions</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${season.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Character in corner - with subtle animation */}
            <div className="absolute bottom-2 right-2">
              <NowruzCharacter
                type={season.character}
                mood={season.mood}
                size="sm"
                position="center"
                interactive={false}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

