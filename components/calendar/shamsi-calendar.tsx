"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { HorizontalYearCalendar } from "./calendar"
import { CategoryFilter } from "./category-filter"
import { fetchUserActivities, UserActivity } from "@/lib/github-service"

// Persian month names in English characters
const persianMonths = [
  "Farvardin",
  "Ordibehesht",
  "Khordad",
  "Tir",
  "Mordad",
  "Shahrivar",
  "Mehr",
  "Aban",
  "Azar",
  "Dey",
  "Bahman",
  "Esfand",
]

// Persian month names in Persian
const persianMonthsPersian = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
]

// Persian weekday names in English characters (abbreviated)
const persianWeekdays = ["Sh", "Ye", "Do", "Se", "Ch", "Pa", "Jo"]

// Persian weekday names in Persian (abbreviated)
const persianWeekdaysPersian = ["ش", "ی", "د", "س", "چ", "پ", "ج"]

export default function ShamsiCalendar(props: {
  username: string,
  isAuthenticated: boolean
}) {
  const [data, setData] = useState<UserActivity[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const loaded = useRef(false)
  useEffect(() => {
    // Generate sample data when component mounts
    if (loaded.current) return;
    loaded.current = true
    fetchUserActivities(props.username, props.isAuthenticated)
    .then(setData)
    .catch((err) => console.error("Error generating sample data:", err))
  }, [])


  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category))
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    else setSelectedCategories([...selectedCategories, category])
  }

  if (!data) return <div className="flex justify-center p-8">Loading calendar data...</div>

  // const filteredHeatmapData = data.heatmapData.filter((item: any) =>
  //   selectedCategories.includes(item.category)
  // )
  // const filteredStreakData = data.streakData.filter((item: any) =>
  //   selectedCategories.includes(item.category)
  // )

  return (
    <Card className="shadow-lg border-stone-700">
      <CardContent>
        {/* <HorizontalYearCalendar
          year={currentYear}
          heatmapData={filteredHeatmapData}
          streakData={filteredStreakData}
          persianMonths={persianMonths}
          persianMonthsPersian={persianMonthsPersian}
          persianWeekdays={persianWeekdays}
          persianWeekdaysPersian={persianWeekdaysPersian}
        />

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Filter Categories</h3>
          <CategoryFilter
            categories={data.categories}
            selectedCategories={selectedCategories}
            onToggle={handleCategoryToggle}
          />
        </div> */}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm border-t pt-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Heatmap:</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800"></div>
              <div className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-900/30"></div>
              <div className="w-3 h-3 rounded bg-emerald-200 dark:bg-emerald-900/50"></div>
              <div className="w-3 h-3 rounded bg-emerald-300 dark:bg-emerald-800/70"></div>
              <div className="w-3 h-3 rounded bg-emerald-500 dark:bg-emerald-700"></div>
            </div>
            <span className="text-xs text-muted-foreground">(Low to High)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Streaks:</span>
            <div className="flex gap-1 items-center">
              <div className="h-2 w-6 rounded bg-green-500 dark:bg-green-600"></div>
              <div className="h-2 w-6 rounded bg-blue-500 dark:bg-blue-600"></div>
              <div className="h-2 w-6 rounded bg-purple-500 dark:bg-purple-600"></div>
            </div>
            <span className="text-xs text-muted-foreground">(Snake-like indicators)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
