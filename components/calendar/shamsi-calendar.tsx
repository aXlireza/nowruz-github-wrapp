"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { generateSampleData } from "@/lib/shamsi-utils"
import { HorizontalYearCalendar } from "./calendar"
import { CategoryFilter } from "./category-filter"
// import { CategoryFilter } from "./category-filter"
// import { HorizontalYearCalendar } from "./horizontal-year-calendar"
// import { generateSampleData } from "@/lib/sample-data"

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

export function ShamsiCalendar() {
  const [currentYear, setCurrentYear] = useState(1402) // Persian year
  const [data, setData] = useState<any>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  useEffect(() => {
    // Generate sample data when component mounts
    const sampleData = generateSampleData()
    setData(sampleData)

    // Initialize with all categories selected
    const allCategories = [
      ...new Set([
        ...sampleData.heatmapData.map((item: any) => item.category),
        ...sampleData.streakData.map((item: any) => item.category),
      ]),
    ]
    setSelectedCategories(allCategories as string[])
  }, [])

  const handlePrevYear = () => {
    setCurrentYear(currentYear - 1)
  }

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1)
  }

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  if (!data) return <div className="flex justify-center p-8">Loading calendar data...</div>

  const filteredHeatmapData = data.heatmapData.filter((item: any) => selectedCategories.includes(item.category))

  const filteredStreakData = data.streakData.filter((item: any) => selectedCategories.includes(item.category))

  return (
    <Card className="shadow-lg border-stone-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={handlePrevYear}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextYear}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <HorizontalYearCalendar
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
        </div>

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

