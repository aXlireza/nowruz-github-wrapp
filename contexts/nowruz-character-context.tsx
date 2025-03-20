"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { NowruzCharacter } from "@/components/nowruz-character"

type CharacterType = "hajiFiruz" | "goldfish" | "sabzeh" | "fire"
type CharacterMood = "happy" | "excited" | "celebrate" | "idle"

interface ShowCharacterOptions {
  type?: CharacterType
  mood?: CharacterMood
  message?: string
  position?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight"
  autoHide?: boolean
  hideAfter?: number
}

interface NowruzCharacterContextType {
  showCharacter: (options: ShowCharacterOptions) => void
  hideCharacter: () => void
}

const NowruzCharacterContext = createContext<NowruzCharacterContextType>({
  showCharacter: () => {},
  hideCharacter: () => {},
})

export function NowruzCharacterProvider({ children }: { children: ReactNode }) {
  const [characterProps, setCharacterProps] = useState<ShowCharacterOptions | null>(null)

  // Show a random character on first load
  useEffect(() => {
    const characters: CharacterType[] = ["hajiFiruz", "goldfish", "sabzeh", "fire"]
    const messages = [
      "Happy Nowruz! Let's explore your GitHub activity!",
      "Welcome to GitHub Stories! I'm here to guide you.",
      "Nowruz Mubarak! Ready to see your coding achievements?",
      "Jump over the fire of bugs and into a new year of coding!",
    ]

    const randomCharacter = characters[Math.floor(Math.random() * characters.length)]
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]

    // Show character after a short delay
    const timer = setTimeout(() => {
      setCharacterProps({
        type: randomCharacter,
        mood: "happy",
        message: randomMessage,
        position: "bottomRight",
        autoHide: true,
        hideAfter: 8000,
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const showCharacter = (options: ShowCharacterOptions) => {
    setCharacterProps(options)
  }

  const hideCharacter = () => {
    setCharacterProps(null)
  }

  return (
    <NowruzCharacterContext.Provider value={{ showCharacter, hideCharacter }}>
      {children}
      {characterProps && <NowruzCharacter {...characterProps} onClose={hideCharacter} />}
    </NowruzCharacterContext.Provider>
  )
}

export const useNowruzCharacter = () => useContext(NowruzCharacterContext)

