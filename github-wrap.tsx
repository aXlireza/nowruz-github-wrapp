"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MoonIcon, SunIcon, GitBranchIcon, GitCommitIcon, GitPullRequestIcon, StarIcon, CodeIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ContributionGraph } from "./components/contribution-graph"
import { LanguageChart } from "./components/language-chart"
import { AchievementCard } from "./components/achievement-card"
import { confetti } from "./lib/confetti"

// Mock data - Would be replaced with real GitHub API data
const mockData = {
  year: 1402, // Shamsi year
  username: "DeveloperName",
  contributions: 423,
  commits: 387,
  pullRequests: 32,
  issuesOpened: 14,
  stars: 48,
  followers: 23,
  newFollowers: 5,
  repositories: 12,
  newRepositories: 3,
  topLanguages: [
    { name: "JavaScript", percentage: 40, color: "#f7df1e" },
    { name: "TypeScript", percentage: 30, color: "#3178c6" },
    { name: "CSS", percentage: 15, color: "#563d7c" },
    { name: "HTML", percentage: 10, color: "#e34c26" },
    { name: "Python", percentage: 5, color: "#3572A5" },
  ],
  contributionsByMonth: [
    { month: "Farvardin", count: 32 },
    { month: "Ordibehesht", count: 41 },
    { month: "Khordad", count: 37 },
    { month: "Tir", count: 28 },
    { month: "Mordad", count: 45 },
    { month: "Shahrivar", count: 53 },
    { month: "Mehr", count: 39 },
    { month: "Aban", count: 42 },
    { month: "Azar", count: 35 },
    { month: "Dey", count: 26 },
    { month: "Bahman", count: 18 },
    { month: "Esfand", count: 27 },
  ],
  achievements: [
    { title: "Pull Request Pro", description: "Opened 30+ pull requests", icon: "GitPullRequestIcon" },
    { title: "Night Owl", description: "Most commits after sunset", icon: "MoonIcon" },
    { title: "Star Collector", description: "Received 25+ stars on repositories", icon: "StarIcon" },
  ],
}

export default function GitHubWrap() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoaded(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }, 1000)
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg">در حال بارگذاری سال نامه گیت‌هاب شما...</p>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background transition-colors duration-300 ${isDarkMode ? "dark" : ""}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-primary mr-2" viewBox="0 0 16 16" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
              ></path>
            </svg>
            <h1 className="text-2xl font-bold">سال نامه گیت‌هاب {mockData.year}</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="relative rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 py-12 px-8 text-white">
              <div className="absolute top-0 right-0 p-4">
                <Badge variant="outline" className="bg-white/20 backdrop-blur-sm text-white border-none">
                  نوروز {mockData.year} مبارک
                </Badge>
              </div>
              <h2 className="text-3xl font-bold mb-2">سلام {mockData.username}!</h2>
              <p className="text-lg mb-6">
                اینجا خلاصه‌ای از فعالیت‌های شما در گیت‌هاب طی سال {mockData.year - 1} تا {mockData.year} است.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <GitCommitIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">کامیت‌ها</span>
                  </div>
                  <p className="text-2xl font-bold">{mockData.commits}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <GitPullRequestIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">درخواست‌های کشش</span>
                  </div>
                  <p className="text-2xl font-bold">{mockData.pullRequests}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <StarIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">ستاره‌ها</span>
                  </div>
                  <p className="text-2xl font-bold">{mockData.stars}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <GitBranchIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm">مخازن</span>
                  </div>
                  <p className="text-2xl font-bold">{mockData.repositories}</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                <path
                  fill="currentColor"
                  fillOpacity="1"
                  d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                ></path>
              </svg>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">مشارکت‌های شما</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>کل مشارکت‌ها</span>
                      <span className="font-bold">{mockData.contributions}</span>
                    </div>
                    <Progress value={(mockData.contributions / 500) * 100} className="h-2" />
                  </div>
                  <ContributionGraph data={mockData.contributionsByMonth} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">زبان‌های برنامه نویسی</h3>
                <LanguageChart data={mockData.topLanguages} />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-10"
        >
          <Tabs defaultValue="achievements">
            <TabsList className="mb-4">
              <TabsTrigger value="achievements">دستاوردها</TabsTrigger>
              <TabsTrigger value="activity">فعالیت‌ها</TabsTrigger>
            </TabsList>
            <TabsContent value="achievements">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockData.achievements.map((achievement, i) => (
                  <AchievementCard
                    key={i}
                    title={achievement.title}
                    description={achievement.description}
                    iconName={achievement.icon}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="activity">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                        <CodeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">بیشترین کامیت‌های شما در روز چهارشنبه بوده است</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                        <MoonIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">۶۵٪ از کامیت‌های شما در شب انجام شده‌اند</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                        <GitBranchIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          شما {mockData.newRepositories} مخزن جدید ایجاد کرده‌اید
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">سال {mockData.year + 1} مبارک!</h3>
              <p className="mb-4">امیدواریم سال جدید سرشار از کدهای تمیز و پروژه‌های موفق باشد.</p>
              <Button
                variant="outline"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-none"
                onClick={() =>
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                  })
                }
              >
                جشن بگیرید! 🎉
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <footer className="mt-20 text-center text-sm text-muted-foreground">
          <p>ساخته شده با 💖 برای توسعه‌دهندگان ایرانی</p>
          <p className="mt-1">تمامی آمار و ارقام نمایش داده شده در این پروژه صرفاً جنبه نمایشی دارند.</p>
        </footer>
      </div>
    </div>
  )
}

