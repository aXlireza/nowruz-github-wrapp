"use client"

import { Card, CardContent } from "@/components/ui/card"
import { GitBranchIcon, GitCommitIcon, GitPullRequestIcon, MoonIcon, StarIcon, CodeIcon } from "lucide-react"

interface AchievementCardProps {
  title: string
  description: string
  iconName: string
}

export function AchievementCard({ title, description, iconName }: AchievementCardProps) {
  const renderIcon = () => {
    switch (iconName) {
      case "GitBranchIcon":
        return <GitBranchIcon className="h-6 w-6" />
      case "GitCommitIcon":
        return <GitCommitIcon className="h-6 w-6" />
      case "GitPullRequestIcon":
        return <GitPullRequestIcon className="h-6 w-6" />
      case "MoonIcon":
        return <MoonIcon className="h-6 w-6" />
      case "StarIcon":
        return <StarIcon className="h-6 w-6" />
      case "CodeIcon":
        return <CodeIcon className="h-6 w-6" />
      default:
        return <StarIcon className="h-6 w-6" />
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="bg-primary/10 p-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">{renderIcon()}</div>
      </div>
      <CardContent className="p-4">
        <h4 className="font-bold">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

