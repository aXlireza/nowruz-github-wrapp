// Simple utility functions for Shamsi (Jalali/Persian) calendar

// Get number of days in a month
export function getDaysInMonth(year: number, month: number): number {
  // Shamsi calendar month days
  if (month < 6) {
    return 31 // First 6 months have 31 days
  } else if (month < 11) {
    return 30 // Next 5 months have 30 days
  } else {
    // Last month (Esfand) has 29 days in normal years, 30 in leap years
    return isLeapYear(year) ? 30 : 29
  }
}

// Check if year is a leap year in Shamsi calendar
export function isLeapYear(year: number): boolean {
  // A simple approximation for Shamsi leap years
  const remainders = [1, 5, 9, 13, 17, 22, 26, 30]
  return remainders.includes(year % 33)
}

// Get the first day of the month (0 = Saturday, 6 = Friday)
export function getFirstDayOfMonth(year: number, month: number): number {
  // This is a simplified algorithm for demonstration
  // In a real app, you would use a proper Shamsi/Gregorian conversion library

  // For demo purposes, we'll use a simple pattern
  const baseDay = (year % 4) * 2 + month
  return baseDay % 7
}

// Convert Shamsi date to a string
export function formatShamsiDate(year: number, month: number, day: number): string {
  return `${year}/${month + 1}/${day}`
}


// Generate sample data for the calendar

// Categories for activities and streaks
const categories = [
  { name: "Learning", type: "Both", color: "green" },
  { name: "Exercise", type: "Both", color: "blue" },
  { name: "Meditation", type: "Streak", color: "purple" },
  { name: "Reading", type: "Streak", color: "amber" },
  { name: "Coding", type: "Both", color: "rose" },
  { name: "Writing", type: "Heatmap", color: "indigo" },
  { name: "Language", type: "Heatmap", color: "cyan" },
]

// Generate random heatmap data
function generateHeatmapData() {
  const data = []
  const year = 1402 // Persian year

  // Generate data for all months
  for (let month = 0; month < 12; month++) {
    const daysInMonth = month < 6 ? 31 : 30

    // Generate random activities for each day
    for (let day = 1; day <= daysInMonth; day++) {
      // Skip some days to create empty spaces
      if (Math.random() > 0.7) continue

      // Generate 1-3 activities per day
      const activitiesCount = Math.floor(Math.random() * 3) + 1

      for (let i = 0; i < activitiesCount; i++) {
        // Select categories that can be used for heatmap
        const heatmapCategories = categories.filter((c) => c.type === "Both" || c.type === "Heatmap")

        const category = heatmapCategories[Math.floor(Math.random() * heatmapCategories.length)].name
        const count = Math.floor(Math.random() * 15) + 1 // 1-15 items

        data.push({
          year,
          month,
          day,
          category,
          count,
        })
      }
    }
  }

  return data
}

// Generate random streak data with consecutive days
function generateStreakData() {
  const data = []
  const year = 1402 // Persian year

  // Generate streaks for each category
  const streakCategories = categories.filter((c) => c.type === "Both" || c.type === "Streak")

  for (const category of streakCategories) {
    // Generate streaks for multiple months
    for (let month = 0; month < 12; month++) {
      // Skip some months
      if (Math.random() > 0.7) continue

      // Generate 1-3 streaks per month
      const streaksCount = Math.floor(Math.random() * 3) + 1

      for (let s = 0; s < streaksCount; s++) {
        // Generate a streak
        const streakLength = Math.floor(Math.random() * 10) + 3 // 3-12 days
        const daysInMonth = month < 6 ? 31 : 30

        // Random starting day (ensure streak fits in month)
        const maxStartDay = daysInMonth - streakLength + 1
        if (maxStartDay < 1) continue // Skip if month is too short for this streak

        const startDay = Math.floor(Math.random() * maxStartDay) + 1

        // Generate streak days
        for (let i = 0; i < streakLength; i++) {
          const day = startDay + i

          data.push({
            year,
            month,
            day,
            category: category.name,
            streakCount: streakLength - i,
          })
        }
      }
    }
  }

  return data
}

// Main function to generate all sample data
export function generateSampleData() {
  return {
    categories,
    heatmapData: generateHeatmapData(),
    streakData: generateStreakData(),
  }
}

