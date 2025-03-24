"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  categories: {
    name: string
    type: string
    color: string
  }[]
  selectedCategories: string[]
  onToggle: (category: string) => void
}

export function CategoryFilter({ categories, selectedCategories, onToggle }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Badge
          key={category.name}
          variant="outline"
          className={cn(
            "cursor-pointer transition-all",
            selectedCategories.includes(category.name)
              ? `bg-${category.color}-100 text-${category.color}-800 hover:bg-${category.color}-200 dark:bg-${category.color}-900/30 dark:text-${category.color}-300 dark:hover:bg-${category.color}-900/50`
              : "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800",
          )}
          onClick={() => onToggle(category.name)}
        >
          <span
            className={cn(
              "inline-block w-2 h-2 rounded-full mr-1",
              `bg-${category.color}-500 dark:bg-${category.color}-400`,
            )}
          />
          {category.name}
          <span className="ml-1 text-xs text-muted-foreground">({category.type})</span>
        </Badge>
      ))}
    </div>
  )
}

