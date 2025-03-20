import { NextResponse } from "next/server"

// GitHub OAuth settings - in production, use environment variables
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const REDIRECT_URI = process.env.NODE_ENV === "production"
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`
  : "http://localhost:3000/api/auth/github/callback"

// Initiate GitHub OAuth flow
export async function GET() {
  // Check if required environment variables are set
  if (!GITHUB_CLIENT_ID) {
    console.error("Missing GITHUB_CLIENT_ID environment variable")
    return NextResponse.json({ error: "Server configuration error: Missing GitHub Client ID" }, { status: 500 })
  }

  // Construct the GitHub authorization URL with proper scopes
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user,repo`

  console.log("Redirecting to GitHub OAuth:", githubAuthUrl)

  return NextResponse.redirect(githubAuthUrl)
}

