interface ConfettiOptions {
  particleCount?: number
  spread?: number
  startVelocity?: number
  decay?: number
  gravity?: number
  drift?: number
  scalar?: number
  ticks?: number
  origin?: {
    x?: number
    y?: number
  }
  colors?: string[]
  shapes?: string[]
  zIndex?: number
}

export function confetti(options: ConfettiOptions = {}) {
  const defaultOptions = {
    particleCount: 50,
    spread: 70,
    startVelocity: 30,
    decay: 0.95,
    gravity: 1,
    drift: 0,
    scalar: 1,
    ticks: 200,
    origin: { x: 0.5, y: 0.3 },
    colors: ["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6"],
    shapes: ["square", "circle"],
    zIndex: 100,
  }

  const mergedOptions = { ...defaultOptions, ...options }

  // We'll load the confetti library dynamically when needed
  import("canvas-confetti").then((confetti) => {
    confetti.default(mergedOptions)
  })
}

