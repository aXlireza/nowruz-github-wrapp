import { Octokit } from "@octokit/rest"

let octokit = new Octokit({})

export function updateOctokit(token: string) {
  debugger
  octokit = new Octokit({
    auth: token,
  })
}

export interface UserActivity {
  date: string
  type: string
  repo: string
}

const SHAMSI_YEAR_1403_FROM = "2024-03-21T00:00:00Z"
const SHAMSI_YEAR_1403_TO = "2025-03-20T23:59:59Z"

// Activity Extractor
export async function fetchUserActivities(username: string, isAuthenticated: boolean): Promise<UserActivity[]> {
  try {
    const per_page = 100 // Fetch more to cover the full date range
    const allEvents: any[] = []
    let page = 1
    let fetchMore = true

    while (fetchMore) {
      const eventsResponse = isAuthenticated ? await octokit.activity.listEventsForAuthenticatedUser({ per_page, page, username })
      : await octokit.activity.listPublicEventsForUser({ username, per_page, page })

      const events = eventsResponse.data
      allEvents.push(...events)
      if (events.length < per_page) fetchMore = false
      page++
    }
    console.log(allEvents);
    
    const activityMap: { [key: string]: string } = {
      PushEvent: "commit",
      PullRequestEvent: "pull_request",
      PullRequestReviewEvent: "review",
      WatchEvent: "star_given",
      CreateEvent: "repo_creation",
      ForkEvent: "fork_made",
      IssueCommentEvent: "issue"
    }

    const activities: UserActivity[] = allEvents
      .filter((event: any) => {
        const eventDate = new Date(event.created_at)
        return (
          eventDate >= new Date(SHAMSI_YEAR_1403_FROM)
          && eventDate <= new Date(SHAMSI_YEAR_1403_TO)
          // && event.type !== "WatchEvent" // Exclude stars given to the user
          // && event.type !== "ForkEvent" // Exclude forks made by others
        )
      })
      .map((event: any) => ({
        date: event.created_at,
        type: activityMap[event.type] || "other",
        repo: event.repo.name,
      }))

    return activities
  } catch (error) {
    console.error("Error fetching GitHub activities:", error)
    throw new Error("Failed to fetch GitHub activities.")
  }
}

// Grouping/ 1. by repo
function groupActivitiesByRepo(activities: UserActivity[]) {
  return activities.reduce((acc, activity) => {
    if (!acc[activity.repo]) {
      acc[activity.repo] = []
    }
    acc[activity.repo].push(activity)
    return acc
  }, {} as { [repo: string]: UserActivity[] })
}

// Grouping/ 2. by date
function groupActivitiesByDate(activities: UserActivity[]) {
  return activities.reduce((acc, activity) => {
    const date = activity.date.split("T")[0] // Extract YYYY-MM-DD
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(activity)
    return acc
  }, {} as { [date: string]: UserActivity[] })
}
