import { Suspense } from "react"
import { GitHubStories } from "@/components/github-stories"
import { SearchForm } from "@/components/search-form"
import { UserInfoCard } from "@/components/user-info-card"
import { Github, SquareArrowOutUpRight, Terminal } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-background shamsi-pattern">
      <div className="container-fluid mx-auto px-4 py-8">
        <header className="mb-8 text-center flex flex-col gap-1">
          <Link href={"https://github.com/aXlireza/nowruz-github-wrapp"} target="_blank" className="bg-transparent border-primary text-primary flex flex-row justify-center gap-1 items-center text-xs mx-auto w-fit p-1 rounded-full hover:bg-primary hover:text-black group">
            <Github className="size-4 p-0 stroke-primary group-hover:stroke-black" />
            <span>GitHub Stories</span>
            <SquareArrowOutUpRight className="size-3 p-0 stroke-primary group-hover:stroke-black" />
          </Link>
          <h1 className="text-5xl font-bold mb-2 flex flex-col-reverse sm:flex-row gap-3 justify-center w-fit mx-auto text-center items-center">
            <Image
              alt="img"
              src={"/icons/Frame 38306.png"}
              width={10}
              height={10}
              className="size-10"
            />
            <span className="bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text">Nowruz Github Wrapp</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            View GitHub activity in an engaging story format with{" "}
            <span className="text-green-500">نوروز</span> celebration vibes.
          </p>
        </header>

        <SearchForm />

        <div className="flex flex-col items-center gap-6">
          <UserInfoCard />

          <Suspense fallback={<StoriesSkeleton />}>
            <GitHubStories />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

function StoriesSkeleton() {
  return (
    <div className="w-full h-[100vh] max-h-[900px] mx-auto">
      <div className="terminal-card w-full h-full relative overflow-hidden">
        <div className="terminal-header">
          <div className="terminal-circle red"></div>
          <div className="terminal-circle yellow"></div>
          <div className="terminal-circle green"></div>
        </div>
        <div className="flex flex-col justify-center items-center h-[calc(100%-38px)] p-6">
          <Terminal className="h-12 w-12 text-primary mb-6" />

          <div className="w-full max-w-md mb-8">
            <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[15%]" />
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Loading GitHub data</span>
              <span>15%</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-primary flex items-center justify-center">
              <span className="typing-indicator mr-2"></span>
              Connecting to GitHub...
            </p>

            <div className="code-block mt-6 text-left max-w-md w-full">
              <div className="code-line">
                <span className="code-line-number">1</span>
                <span className="keyword">async function</span> <span className="function">loadGitHubStories</span>
                {"(username) {"}
              </div>
              <div className="code-line">
                <span className="code-line-number">2</span>
                &nbsp;&nbsp;<span className="keyword">const</span> data = <span className="keyword">await</span>{" "}
                <span className="function">fetchGitHubData</span>
                {"(username)"}
              </div>
              <div className="code-line">
                <span className="code-line-number">3</span>
                &nbsp;&nbsp;<span className="comment">// Initializing...</span>
              </div>
              <div className="code-line">
                <span className="code-line-number">4</span>
                &nbsp;&nbsp;<span className="keyword">return</span> <span className="function">renderStories</span>
                {"(data)"}
              </div>
              <div className="code-line">
                <span className="code-line-number">5</span>
                {"}"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

