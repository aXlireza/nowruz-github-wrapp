import { NextResponse } from "next/server"
import { fetchGitHubUserData } from "@/lib/github-service"

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const username = params.username

  try {
    const data = await fetchGitHubUserData(username)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching GitHub data:", error)
    return NextResponse.json(
      { error: "Failed to fetch GitHub data. Please check the username and try again." },
      { status: 500 },
    )
  }
}

