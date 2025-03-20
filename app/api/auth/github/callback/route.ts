import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    console.error("No code provided in GitHub OAuth callback")
    return NextResponse.redirect(new URL("/?error=oauth_callback_error", request.url))
  }

  // Check if required environment variables are set
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.error("Missing GitHub OAuth credentials in environment variables")
    return NextResponse.redirect(new URL("/?error=server_configuration_error", request.url))
  }

  try {
    console.log("Exchanging code for token...")

    // Exchange code for token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.NODE_ENV === 'production'
          ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/github/callback`
          : "http://localhost:3000/api/auth/github/callback",
      }),
    })

    const data = await tokenResponse.json()

    if (data.error) {
      console.error("GitHub OAuth error:", data.error)
      return NextResponse.redirect(new URL(`/?error=${data.error}`, request.url))
    }

    if (!data.access_token) {
      console.error("No access token received from GitHub")
      return NextResponse.redirect(new URL("/?error=no_access_token", request.url))
    }

    console.log("Successfully received access token")

    // Redirect to home with the token in the URL
    return NextResponse.redirect(new URL(`/?token=${data.access_token}`, request.url))
  } catch (error) {
    console.error("GitHub OAuth error:", error)
    return NextResponse.redirect(new URL("/?error=server_error", request.url))
  }
}

