import { Octokit } from "@octokit/rest"

// Initialize Octokit - will be updated with token when available
let octokit = new Octokit({
  // auth: process.env.GITHUB_TOKEN,
})

// Function to update Octokit with a user token
export function updateOctokit(token: string) {
  octokit = new Octokit({
    auth: token,
  })
}

export interface UserProfile {
  login: string
  name: string | null
  avatarUrl: string
  bio: string | null
  followers: number
  following: number
  publicRepos: number
  createdAt: string
}

export interface Repository {
  id: number
  name: string
  description: string | null
  language: string | null
  stargazersCount: number
  forksCount: number
  updatedAt: string
  url: string
}

export interface Contribution {
  date: string
  count: number
}

export interface UserActivity {
  type: string
  repo: {
    name: string
    url: string
  }
  createdAt: string
  payload?: any
}

export interface UserData {
  profile: UserProfile
  topRepositories: Repository[]
  recentActivity: UserActivity[]
  contributionsLastYear: Contribution[]
  languages: { [key: string]: number }
  performanceScore: number
}

export async function fetchGitHubUserData(username: string): Promise<UserData> {
  try {
    // Fetch user profile
    const { data: user } = await octokit.users.getByUsername({
      username,
    })

    // Fetch user repositories
    const { data: repos } = await octokit.repos.listForUser({
      username,
      sort: "updated",
      per_page: 5,
    })

    // Fetch user events (activity)
    const { data: events } = await octokit.activity.listPublicEventsForUser({
      username,
      per_page: 10,
    })

    // Calculate contributions (simplified - in a real app, you'd use the GraphQL API)
    const contributionsLastYear: Contribution[] = generateMockContributions()

    // Calculate languages (simplified)
    const languages = calculateLanguages(repos)

    // Calculate performance score
    const performanceScore = calculatePerformanceScore(user, repos, events, contributionsLastYear)

    return {
      profile: {
        login: user.login,
        name: user.name,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        publicRepos: user.public_repos,
        createdAt: user.created_at,
      },
      topRepositories: repos.map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        language: repo.language || null,
        stargazersCount: repo.stargazers_count || 0,
        forksCount: repo.forks_count || 0,
        updatedAt: repo.updated_at || '',
        url: repo.html_url,
      })),
      recentActivity: events.map((event) => ({
        type: event.type,
        repo: {
          name: event.repo.name,
          url: `https://github.com/${event.repo.name}`,
        },
        createdAt: event.created_at || '',
        payload: event.payload,
      })),
      contributionsLastYear,
      languages,
      performanceScore,
    }
  } catch (error) {
    console.error("Error fetching GitHub data:", error)
    throw new Error("Failed to fetch GitHub data. Please check the username and try again.")
  }
}

// Helper functions
function generateMockContributions(): Contribution[] {
  const contributions: Contribution[] = []
  const today = new Date()

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    contributions.push({
      date: date.toISOString().split("T")[0],
      count: Math.floor(Math.random() * 10),
    })
  }

  return contributions
}

function calculateLanguages(repos: any[]): { [key: string]: number } {
  const languages: { [key: string]: number } = {}

  repos.forEach((repo) => {
    if (repo.language) {
      if (languages[repo.language]) {
        languages[repo.language]++
      } else {
        languages[repo.language] = 1
      }
    }
  })

  return languages
}

function calculatePerformanceScore(user: any, repos: any[], events: any[], contributions: Contribution[]): number {
  // This is a simplified scoring algorithm
  const repoScore = Math.min(repos.reduce((sum, repo) => sum + repo.stargazers_count + repo.forks_count, 0) / 10, 40)
  const activityScore = Math.min(events.length * 2, 20)
  const contributionScore = Math.min(contributions.reduce((sum, day) => sum + day.count, 0) / 100, 30)
  const followerScore = Math.min(user.followers / 10, 10)

  return Math.min(Math.round(repoScore + activityScore + contributionScore + followerScore), 100)
}

