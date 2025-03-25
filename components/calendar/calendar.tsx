"use client"

import { useRef } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { generateSampleDataWithMetrics, getDaysInMonth, getFirstDayOfMonth } from "@/lib/shamsi-utils"

interface HorizontalYearCalendarProps {
  year: number
  heatmapData: any[]
  streakData: any[]
  persianMonths: string[]
  persianMonthsPersian: string[]
  persianWeekdays: string[]
  persianWeekdaysPersian: string[]
}

export function HorizontalYearCalendar({
  year,
  heatmapData,
  streakData,
  persianMonths,
  persianMonthsPersian,
}: HorizontalYearCalendarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Calculate activity intensity for heatmap coloring
  const getActivityIntensity = (activities: any[]) => {
    if (!activities.length) return 0

    const totalCount = activities.reduce((sum, item) => sum + item.count, 0)

    if (totalCount === 0) return 0
    if (totalCount <= 2) return 1
    if (totalCount <= 5) return 2
    if (totalCount <= 10) return 3
    return 4
  }

  // Get streak data for a specific day
  const getDayStreaks = (month: number, day: number) => {
    return streakData.filter((item) => item.year === year && item.month === month && item.day === day)
  }

  // Get activity data for a specific day
  const getDayActivity = (month: number, day: number) => {
    return heatmapData.filter((item) => item.year === year && item.month === month && item.day === day)
  }

  // Check if a day is part of a streak and get streak info
  const getStreakInfo = (month: number, day: number) => {
    const streaks = getDayStreaks(month, day)
    if (!streaks.length) return null

    // Get the longest streak for this day
    const longestStreak = streaks.reduce(
      (longest, current) => (current.streakCount > longest.streakCount ? current : longest),
      streaks[0],
    )

    // Check if the previous day is part of the same streak
    const prevDay = day - 1
    const prevDayStreaks = prevDay > 0 ? getDayStreaks(month, prevDay) : []
    const isPrevDayInStreak = prevDayStreaks.some(
      (s) => s.category === longestStreak.category && s.streakCount === longestStreak.streakCount + 1,
    )

    // Check if the next day is part of the same streak
    const nextDay = day + 1
    const daysInMonth = getDaysInMonth(year, month)
    const nextDayStreaks = nextDay <= daysInMonth ? getDayStreaks(month, nextDay) : []
    const isNextDayInStreak = nextDayStreaks.some(
      (s) => s.category === longestStreak.category && s.streakCount === longestStreak.streakCount - 1,
    )

    return {
      category: longestStreak.category,
      streakCount: longestStreak.streakCount,
      isPrevDayInStreak,
      isNextDayInStreak,
    }
  }

  // Get color for streak category
  const getStreakColor = (category: string) => {
    // const catIntel = categories.find(cat => cat.name === category)
    // if (catIntel) return `bg-${catIntel.color}-500/20 border-${catIntel.color}-500/70 dark:bg-${catIntel.color}-600/20 dark:border-${catIntel.color}-600/70`
    return "bg-slate-500/20 border-slate-500/70 dark:bg-slate-600/20 dark:border-slate-600/70"
  }

  // Get border radius for streak segments
  const getStreakBorderRadius = (isPrevDayInStreak: boolean, isNextDayInStreak: boolean) => {
    if (isPrevDayInStreak && isNextDayInStreak) return "rounded-none"
    if (isPrevDayInStreak) return "rounded-r"
    if (isNextDayInStreak) return "rounded-l"
    return "rounded"
  }

  // Render a single month
  const renderMonth = (month: number) => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    // Create calendar days array
    const calendarDays = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day)
    }

    return (
      <div key={month} className="flex-shrink-0 w-fit">
        <div className="text-center mb-5">
          <div className="font-medium text-xs text-primary">{persianMonthsPersian[month]}</div>
          {/* <div className="text-[10px] text-muted-foreground">{persianMonths[month]}</div> */}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-0">
          {calendarDays.map((day, index) => {
            if (day === null) return <div key={`empty-${index}`} className="size-fit" />

            const activities = getDayActivity(month, day)
            const intensity = getActivityIntensity(activities)
            const streakInfo = getStreakInfo(month, day)

            return (
              <TooltipProvider key={`day-${day}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative w-fit p-1.5">
                      <div
                        className={cn(
                          "relative size-2 z-20 rounded-[2px] cursor-pointer transition-all",
                          intensity === 0 &&
                            "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700",
                          intensity === 1 &&
                            "bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50",
                          intensity === 2 &&
                            "bg-emerald-200 hover:bg-emerald-300 dark:bg-emerald-900/50 dark:hover:bg-emerald-900/70",
                          intensity === 3 &&
                            "bg-emerald-300 hover:bg-emerald-400 dark:bg-emerald-800/70 dark:hover:bg-emerald-800/90",
                          intensity === 4 &&
                            "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-700 dark:hover:bg-emerald-600",
                        )}
                      />

                      {/* Streak snake effect */}
                      {streakInfo && (
                        <div
                          className={cn(
                            "absolute z-10 bottom-0 h-full left-0 right-0 border-[0.1px]",
                            getStreakColor(streakInfo.category),
                            getStreakBorderRadius(streakInfo.isPrevDayInStreak, streakInfo.isNextDayInStreak),
                          )}
                        />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <div className="font-medium">
                        {persianMonths[month]} {day}, {year}
                      </div>

                      {/* Activity data */}
                      {activities.length > 0 && (
                        <div className="mt-1">
                          <div className="font-medium">Activities:</div>
                          {activities.map((activity, i) => (
                            <div key={i} className="flex justify-between gap-4">
                              <span>{activity.category}:</span>
                              <span>{activity.count} items</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Streak data */}
                      {streakInfo && (
                        <div className="mt-1">
                          <div className="font-medium">Streak:</div>
                          <div className="flex justify-between gap-4">
                            <span>{streakInfo.category}:</span>
                            <span>{streakInfo.streakCount} day streak</span>
                          </div>
                        </div>
                      )}

                      {activities.length === 0 && !streakInfo && <div>No activity or streaks</div>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="relative">
        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-4 px-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent"
          style={{ scrollbarWidth: "thin" }}
        >
          {Array.from({ length: 12 }).map((_, month) => renderMonth(month))}
        </div>
      </div>
    </div>
  )
}

