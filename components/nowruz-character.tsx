"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

type CharacterType = "hajiFiruz" | "goldfish" | "sabzeh" | "fire"
type CharacterMood = "happy" | "excited" | "celebrate" | "idle" | "dance" | "jump"

interface NowruzCharacterProps {
  type?: CharacterType
  mood?: CharacterMood
  message?: string
  position?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" | "center"
  onClose?: () => void
  autoHide?: boolean
  hideAfter?: number // in milliseconds
  size?: "sm" | "md" | "lg"
  className?: string
  style?: React.CSSProperties
  interactive?: boolean
}

export function NowruzCharacter({
  type = "hajiFiruz",
  mood = "happy",
  message,
  position = "bottomRight",
  onClose,
  autoHide = false,
  hideAfter = 5000,
  size = "md",
  className = "",
  style = {},
  interactive = true,
}: NowruzCharacterProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [currentMood, setCurrentMood] = useState<CharacterMood>(mood)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (autoHide && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onClose) onClose()
      }, hideAfter)

      return () => clearTimeout(timer)
    }
  }, [autoHide, hideAfter, isVisible, onClose])

  // Update mood when prop changes
  useEffect(() => {
    setCurrentMood(mood)
  }, [mood])

  const getPositionStyles = () => {
    switch (position) {
      case "topLeft":
        return { top: "20px", left: "20px" }
      case "topRight":
        return { top: "20px", right: "20px" }
      case "bottomLeft":
        return { bottom: "20px", left: "20px" }
      case "bottomRight":
        return { bottom: "20px", right: "20px" }
      case "center":
        return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" }
      default:
        return { bottom: "20px", right: "20px" }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return { width: "60px", height: "60px" }
      case "lg":
        return { width: "120px", height: "120px" }
      case "md":
      default:
        return { width: "80px", height: "80px" }
    }
  }

  const handleInteraction = () => {
    if (!interactive) return

    // Cycle through moods on click
    const moods: CharacterMood[] = ["happy", "excited", "celebrate", "dance", "jump"]
    const currentIndex = moods.indexOf(currentMood)
    const nextIndex = (currentIndex + 1) % moods.length
    setCurrentMood(moods[nextIndex])
  }

  const renderCharacter = () => {
    switch (type) {
      case "hajiFiruz":
        return <HajiFiruz mood={currentMood} />
      case "goldfish":
        return <Goldfish mood={currentMood} />
      case "sabzeh":
        return <Sabzeh mood={currentMood} />
      case "fire":
        return <Fire mood={currentMood} />
      default:
        return <HajiFiruz mood={currentMood} />
    }
  }

  const containerStyles = {
    ...getPositionStyles(),
    ...style,
  }

  const characterContainerStyles = {
    ...getSizeStyles(),
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`${position === "center" ? "absolute" : "fixed"} z-50 flex items-end ${className}`}
          style={containerStyles}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
          }}
        >
          <div className="relative">
            {message && (
              <motion.div
                className="absolute bottom-full mb-2 p-3 bg-black/80 backdrop-blur-sm rounded-lg text-white max-w-[200px] border border-primary/30"
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                style={{
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                  transform: "perspective(1000px) rotateX(5deg)",
                }}
              >
                <div className="text-sm">{message}</div>
                <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black/80 rotate-45 border-r border-b border-primary/30"></div>
              </motion.div>
            )}

            <motion.div
              className="relative cursor-pointer"
              style={characterContainerStyles}
              onClick={handleInteraction}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              whileHover={{
                scale: interactive ? 1.05 : 1,
                transition: { duration: 0.3 },
              }}
              whileTap={{
                scale: interactive ? 0.95 : 1,
                transition: { duration: 0.2 },
              }}
            >
              {/* 3D shadow effect - more subtle */}
              <motion.div
                className="absolute inset-0 rounded-full bg-black/20 blur-md"
                style={{
                  zIndex: -1,
                  transformOrigin: "center bottom",
                }}
                animate={{
                  scale: isHovered ? 0.95 : 1,
                  y: isHovered ? 3 : 0,
                }}
                transition={{ duration: 0.4 }}
              />

              {renderCharacter()}

              {onClose && (
                <motion.button
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/80 text-white flex items-center justify-center text-xs border border-gray-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsVisible(false)
                    if (onClose) onClose()
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Haji Firuz Character with more subtle 3D effects
function HajiFiruz({ mood }: { mood: CharacterMood }) {
  // More subtle base animation
  const baseAnimation = {
    y: [0, -5, 0],
    rotateY: [0, 3, 0, -3, 0],
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      repeatType: "reverse" as const,
    },
  }

  const moodAnimations = {
    happy: baseAnimation,
    excited: {
      y: [0, -7, 0],
      rotate: [-3, 3, -3],
      scale: [1, 1.03, 1],
      transition: {
        duration: 0.8,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
    },
    celebrate: {
      y: [0, -10, 0],
      scale: [1, 1.05, 1],
      rotateZ: [0, 3, 0, -3, 0],
      transition: {
        duration: 1.2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
    },
    idle: {
      y: [0, -2, 0],
      rotateY: [0, 2, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
    },
    dance: {
      y: [0, -3, 0, -3, 0],
      x: [-3, 3, -3, 3, -3],
      rotate: [-5, 5, -5, 5, -5],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
    },
    jump: {
      y: [0, -15, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.7,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      className="w-full h-full bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden border-2 border-red-500"
      animate={moodAnimations[mood]}
      style={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), inset 0 5px 10px rgba(255, 255, 255, 0.1)",
        transform: "perspective(1000px)",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Face */}
        <circle cx="50" cy="50" r="40" fill="#222222" />

        {/* Red hat with 3D effect */}
        <motion.g
          animate={{
            y: mood === "jump" ? [-3, 0, -3] : 0,
            rotateX: [0, 3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <path d="M25 30C25 30 30 10 50 10C70 10 75 30 75 30" fill="#FF0000" />
          <path d="M25 30C25 30 30 15 50 15C70 15 75 30 75 30" stroke="#CC0000" strokeWidth="2" />
          {/* Hat highlight for 3D effect */}
          <path d="M35 20C35 20 40 15 50 15C60 15 65 20 65 20" stroke="#FF5555" strokeWidth="1" opacity="0.5" />
        </motion.g>

        {/* Eyes with blinking and mood expressions */}
        <motion.g
          animate={{
            scaleY: mood === "excited" || mood === "celebrate" ? [1, 0.1, 1] : [1, 0.1, 1],
          }}
          transition={{
            duration: 0.3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            repeatDelay: mood === "excited" || mood === "celebrate" ? 1 : 4,
          }}
        >
          <circle cx="35" cy="45" r="5" fill="white" />
          <circle cx="65" cy="45" r="5" fill="white" />
          <motion.circle
            cx="35"
            cy="45"
            r="2.5"
            fill="black"
            animate={{
              x: mood === "dance" ? [0, 1, 0, -1, 0] : 0,
              y: mood === "dance" ? [0, 1, 0, -1, 0] : 0,
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
          <motion.circle
            cx="65"
            cy="45"
            r="2.5"
            fill="black"
            animate={{
              x: mood === "dance" ? [0, 1, 0, -1, 0] : 0,
              y: mood === "dance" ? [0, 1, 0, -1, 0] : 0,
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        </motion.g>

        {/* Mouth with expressions */}
        <motion.path
          d="M40 65 Q50 75 60 65"
          stroke="white"
          strokeWidth="3"
          fill="transparent"
          animate={{
            d:
              mood === "celebrate" || mood === "dance"
                ? "M35 65 Q50 80 65 65"
                : mood === "excited"
                  ? "M35 65 Q50 75 65 65"
                  : "M40 65 Q50 75 60 65",
          }}
          transition={{
            duration: 0.4,
          }}
        />

        {/* Red outfit with 3D effect */}
        <motion.path
          d="M30 90C30 90 35 80 50 80C65 80 70 90 70 90"
          fill="#FF0000"
          animate={{
            y: mood === "dance" ? [0, -1, 0, -1, 0] : 0,
          }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
          }}
        />

        {/* Hands that move with mood */}
        <motion.g
          animate={{
            rotate:
              mood === "dance"
                ? [0, 15, 0, -15, 0]
                : mood === "celebrate"
                  ? [0, 20, 0]
                  : mood === "jump"
                    ? [0, 30, 0]
                    : 0,
            y: mood === "jump" ? [-3, 0, -3] : 0,
          }}
          transition={{
            duration: mood === "dance" ? 1.5 : 0.8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{ originX: "30px", originY: "60px" }}
        >
          <path d="M30 60L20 70" stroke="#FF0000" strokeWidth="4" strokeLinecap="round" />
        </motion.g>

        <motion.g
          animate={{
            rotate:
              mood === "dance"
                ? [0, -15, 0, 15, 0]
                : mood === "celebrate"
                  ? [0, -20, 0]
                  : mood === "jump"
                    ? [0, -30, 0]
                    : 0,
            y: mood === "jump" ? [-3, 0, -3] : 0,
          }}
          transition={{
            duration: mood === "dance" ? 1.5 : 0.8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 0.2,
          }}
          style={{ originX: "70px", originY: "60px" }}
        >
          <path d="M70 60L80 70" stroke="#FF0000" strokeWidth="4" strokeLinecap="round" />
        </motion.g>
      </svg>
    </motion.div>
  )
}

// Goldfish Character with more subtle 3D effects
function Goldfish({ mood }: { mood: CharacterMood }) {
  return (
    <motion.div
      className="w-full h-full bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden border-2 border-orange-400"
      animate={{
        y: [0, -3, 0],
        rotate: mood === "excited" || mood === "celebrate" ? [-3, 3, -3] : 0,
        scale: mood === "celebrate" ? [1, 1.05, 1] : 1,
        rotateY: mood === "dance" ? [0, 180, 360] : 0,
      }}
      transition={{
        duration: mood === "dance" ? 3 : mood === "idle" ? 4 : 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      style={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), inset 0 5px 10px rgba(255, 255, 255, 0.1)",
        transform: "perspective(1000px)",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body with 3D gradient effect */}
        <motion.path
          d="M30 50C30 35 40 30 50 30C60 30 70 35 70 50C70 65 60 70 50 70C40 70 30 65 30 50Z"
          fill="url(#fishGradient)"
          animate={{
            d: [
              "M30 50C30 35 40 30 50 30C60 30 70 35 70 50C70 65 60 70 50 70C40 70 30 65 30 50Z",
              "M32 50C32 37 42 32 50 32C58 32 68 37 68 50C68 63 58 68 50 68C42 68 32 63 32 50Z",
              "M30 50C30 35 40 30 50 30C60 30 70 35 70 50C70 65 60 70 50 70C40 70 30 65 30 50Z",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* Define gradient for 3D effect */}
        <defs>
          <linearGradient id="fishGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF9F1C" />
            <stop offset="50%" stopColor="#FFBF69" />
            <stop offset="100%" stopColor="#FF9F1C" />
          </linearGradient>
          <filter id="fishShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Tail with enhanced movement */}
        <motion.path
          d="M30 50L15 40L15 60L30 50Z"
          fill="#FF9F1C"
          filter="url(#fishShadow)"
          animate={{
            d:
              mood === "dance" || mood === "excited"
                ? ["M30 50L10 35L10 65L30 50Z", "M30 50L20 45L20 55L30 50Z", "M30 50L10 35L10 65L30 50Z"]
                : ["M30 50L15 40L15 60L30 50Z", "M30 50L10 35L10 65L30 50Z", "M30 50L15 40L15 60L30 50Z"],
          }}
          transition={{
            duration: mood === "dance" || mood === "excited" ? 0.8 : 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* Eye with blinking and expressions */}
        <motion.g
          animate={{
            scaleY: mood === "excited" || mood === "celebrate" ? [1, 0.1, 1] : [1, 0.1, 1],
            x: mood === "dance" ? [0, 2, 0, -2, 0] : 0,
          }}
          transition={{
            duration: 0.3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            repeatDelay: mood === "excited" || mood === "celebrate" ? 1 : 4,
          }}
        >
          <circle cx="60" cy="45" r="5" fill="white" />
          <circle cx="60" cy="45" r="2.5" fill="black" />
        </motion.g>

        {/* Mouth with expressions */}
        <motion.path
          d="M55 55 Q60 58 65 55"
          stroke="black"
          strokeWidth="2"
          fill="transparent"
          animate={{
            d:
              mood === "celebrate" || mood === "dance"
                ? "M55 55 Q60 62 65 55"
                : mood === "excited"
                  ? "M55 55 Q60 60 65 55"
                  : "M55 55 Q60 58 65 55",
          }}
          transition={{
            duration: 0.4,
          }}
        />

        {/* Fins with enhanced movement */}
        <motion.path
          d="M50 30L55 20L60 30"
          fill="#FF9F1C"
          filter="url(#fishShadow)"
          animate={{
            d:
              mood === "dance" || mood === "jump"
                ? ["M50 30L55 15L60 30", "M50 30L55 25L60 30", "M50 30L55 15L60 30"]
                : ["M50 30L55 20L60 30", "M50 30L55 15L60 30", "M50 30L55 20L60 30"],
            rotate: mood === "dance" ? [0, 5, 0, -5, 0] : 0,
          }}
          transition={{
            duration: mood === "dance" || mood === "jump" ? 0.8 : 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
          style={{ transformOrigin: "55px 30px" }}
        />

        <motion.path
          d="M50 70L55 80L60 70"
          fill="#FF9F1C"
          filter="url(#fishShadow)"
          animate={{
            d:
              mood === "dance" || mood === "jump"
                ? ["M50 70L55 85L60 70", "M50 70L55 75L60 70", "M50 70L55 85L60 70"]
                : ["M50 70L55 80L60 70", "M50 70L55 85L60 70", "M50 70L55 80L60 70"],
            rotate: mood === "dance" ? [0, -5, 0, 5, 0] : 0,
          }}
          transition={{
            duration: mood === "dance" || mood === "jump" ? 0.8 : 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 0.5,
          }}
          style={{ transformOrigin: "55px 70px" }}
        />

        {/* Bubbles for swimming effect - only for active moods */}
        {mood === "dance" || mood === "excited" || mood === "celebrate" ? (
          <motion.g>
            <motion.circle
              cx="75"
              cy="40"
              r="3"
              fill="rgba(255, 255, 255, 0.7)"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x: 15, y: -15, opacity: [0, 0.7, 0] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: 0.2,
              }}
            />
            <motion.circle
              cx="80"
              cy="35"
              r="2.5"
              fill="rgba(255, 255, 255, 0.7)"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x: 10, y: -10, opacity: [0, 0.7, 0] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: 0.8,
              }}
            />
            <motion.circle
              cx="78"
              cy="45"
              r="2"
              fill="rgba(255, 255, 255, 0.7)"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x: 15, y: -15, opacity: [0, 0.7, 0] }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: 1,
              }}
            />
          </motion.g>
        ) : null}
      </svg>
    </motion.div>
  )
}

// Sabzeh (Sprouting Wheat) Character with more subtle 3D effects
function Sabzeh({ mood }: { mood: CharacterMood }) {
  return (
    <motion.div
      className="w-full h-full bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden border-2 border-green-500"
      animate={{
        y: [0, -3, 0],
        rotate: mood === "excited" || mood === "celebrate" ? [-2, 2, -2] : 0,
        scale: mood === "celebrate" ? [1, 1.03, 1] : 1,
      }}
      transition={{
        duration: mood === "idle" ? 4 : 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      style={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), inset 0 5px 10px rgba(255, 255, 255, 0.1)",
        transform: "perspective(1000px)",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Define gradients and filters for 3D effect */}
        <defs>
          <linearGradient id="potGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CD7F32" />
            <stop offset="50%" stopColor="#E6B17F" />
            <stop offset="100%" stopColor="#CD7F32" />
          </linearGradient>
          <linearGradient id="soilGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5D4037" />
            <stop offset="50%" stopColor="#795548" />
            <stop offset="100%" stopColor="#5D4037" />
          </linearGradient>
          <filter id="sproutShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Pot with 3D effect */}
        <motion.g
          animate={{
            y: mood === "jump" ? [0, -7, 0] : 0,
            rotate: mood === "dance" ? [-1, 1, -1] : 0,
          }}
          transition={{
            duration: mood === "jump" ? 0.8 : 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <path d="M30 70L35 90H65L70 70" fill="url(#potGradient)" filter="url(#sproutShadow)" />
          <path d="M30 70C30 70 40 75 50 75C60 75 70 70 70 70" fill="url(#potGradient)" />

          {/* Pot highlight for 3D effect */}
          <path d="M35 75C35 75 40 78 50 78C60 78 65 75 65 75" stroke="#E6B17F" strokeWidth="1" opacity="0.5" />
        </motion.g>

        {/* Soil with 3D effect */}
        <path
          d="M35 70C35 70 40 73 50 73C60 73 65 70 65 70V65C65 65 60 68 50 68C40 68 35 65 35 65V70Z"
          fill="url(#soilGradient)"
        />

        {/* Sprouts with enhanced movement */}
        <motion.g
          animate={{
            y: mood === "celebrate" || mood === "jump" ? [-3, 0, -3] : 0,
            rotate: mood === "dance" ? [-3, 3, -3] : 0,
          }}
          transition={{
            duration: mood === "dance" ? 1.5 : 0.8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <motion.path
            d="M45 65C45 65 43 50 45 40C47 30 50 25 50 25"
            stroke="#4CAF50"
            strokeWidth="2"
            filter="url(#sproutShadow)"
            animate={{
              d:
                mood === "dance" || mood === "excited"
                  ? [
                      "M45 65C45 65 40 50 45 35C50 25 50 20 50 20",
                      "M45 65C45 65 45 50 45 40C45 30 50 25 50 25",
                      "M45 65C45 65 40 50 45 35C50 25 50 20 50 20",
                    ]
                  : [
                      "M45 65C45 65 43 50 45 40C47 30 50 25 50 25",
                      "M45 65C45 65 45 50 45 40C45 30 50 25 50 25",
                      "M45 65C45 65 43 50 45 40C47 30 50 25 50 25",
                    ],
            }}
            transition={{
              duration: mood === "dance" || mood === "excited" ? 1 : 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />

          <motion.path
            d="M55 65C55 65 57 50 55 40C53 30 50 25 50 25"
            stroke="#4CAF50"
            strokeWidth="2"
            filter="url(#sproutShadow)"
            animate={{
              d:
                mood === "dance" || mood === "jump"
                  ? [
                      "M55 65C55 65 60 50 55 35C50 25 50 20 50 20",
                      "M55 65C55 65 55 50 55 40C55 30 50 25 50 25",
                      "M55 65C55 65 60 50 55 35C50 25 50 20 50 20",
                    ]
                  : [
                      "M55 65C55 65 57 50 55 40C53 30 50 25 50 25",
                      "M55 65C55 65 55 50 55 40C55 30 50 25 50 25",
                      "M55 65C55 65 57 50 55 40C53 30 50 25 50 25",
                    ],
            }}
            transition={{
              duration: mood === "dance" || mood === "jump" ? 0.8 : 1.2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 0.2,
            }}
          />
        </motion.g>
      </svg>
    </motion.div>
  )
}

// Fire (Chaharshanbe Suri) Character with more subtle 3D effects
function Fire({ mood }: { mood: CharacterMood }) {
  return (
    <motion.div
      className="w-full h-full bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden border-2 border-orange-500"
      animate={{
        y: [0, -3, 0],
        rotate: mood === "excited" || mood === "celebrate" ? [-2, 2, -2] : 0,
        scale: mood === "celebrate" ? [1, 1.03, 1] : 1,
      }}
      transition={{
        duration: mood === "idle" ? 4 : 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      style={{
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), inset 0 5px 10px rgba(255, 255, 255, 0.1)",
        transform: "perspective(1000px)",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Define gradients and filters for 3D effect */}
        <defs>
          <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5722" />
            <stop offset="50%" stopColor="#FF9800" />
            <stop offset="100%" stopColor="#FFEB3B" />
          </linearGradient>
          <filter id="fireShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#FF5722" floodOpacity="0.3" />
          </filter>
          <filter id="fireGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Fire base */}
        <motion.path
          d="M30 70C30 70 35 90 50 90C65 90 70 70 70 70C70 70 65 75 50 75C35 75 30 70 30 70Z"
          fill="#FF9800"
          animate={{
            d: [
              "M30 70C30 70 35 90 50 90C65 90 70 70 70 70C70 70 65 75 50 75C35 75 30 70 30 70Z",
              "M32 70C32 70 37 88 50 88C63 88 68 70 68 70C68 70 63 73 50 73C37 73 32 70 32 70Z",
              "M30 70C30 70 35 90 50 90C65 90 70 70 70 70C70 70 65 75 50 75C35 75 30 70 30 70Z",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        {/* Fire flames with 3D effect */}
        <motion.g filter="url(#fireGlow)">
          <motion.path
            d="M40 70C40 70 35 50 50 40C65 50 60 70 60 70"
            fill="url(#fireGradient)"
            filter="url(#fireShadow)"
            animate={{
              d:
                mood === "dance" || mood === "excited"
                  ? [
                      "M40 70C40 70 30 45 50 30C70 45 60 70 60 70",
                      "M40 70C40 70 40 55 50 45C60 55 60 70 60 70",
                      "M40 70C40 70 30 45 50 30C70 45 60 70 60 70",
                    ]
                  : [
                      "M40 70C40 70 35 50 50 40C65 50 60 70 60 70",
                      "M40 70C40 70 30 45 50 35C70 45 60 70 60 70",
                      "M40 70C40 70 35 50 50 40C65 50 60 70 60 70",
                    ],
            }}
            transition={{
              duration: mood === "dance" || mood === "excited" ? 1 : 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />

          <motion.path
            d="M45 70C45 70 43 55 50 45C57 55 55 70 55 70"
            fill="#FFEB3B"
            animate={{
              d:
                mood === "dance" || mood === "jump"
                  ? [
                      "M45 70C45 70 40 50 50 40C60 50 55 70 55 70",
                      "M45 70C45 70 45 60 50 50C55 60 55 70 55 70",
                      "M45 70C45 70 40 50 50 40C60 50 55 70 55 70",
                    ]
                  : [
                      "M45 70C45 70 43 55 50 45C57 55 55 70 55 70",
                      "M45 70C45 70 40 50 50 42C60 50 55 70 55 70",
                      "M45 70C45 70 43 55 50 45C57 55 55 70 55 70",
                    ],
            }}
            transition={{
              duration: mood === "dance" || mood === "jump" ? 0.8 : 1.2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: 0.2,
            }}
          />
        </motion.g>

        {/* Sparks for fire effect - more subtle */}
        {mood === "dance" || mood === "excited" || mood === "celebrate" ? (
          <motion.g>
            <motion.circle
              cx="45"
              cy="40"
              r="1.5"
              fill="#FFEB3B"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: [-7, -10, -15],
                y: [-7, -15, -10],
                opacity: [0, 0.7, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: 0.2,
              }}
            />
            <motion.circle
              cx="55"
              cy="35"
              r="1"
              fill="#FFEB3B"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: [3, 7, 10],
                y: [-10, -15, -12],
                opacity: [0, 0.7, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.8,
                repeat: Number.POSITIVE_INFINITY,
                delay: 0.5,
              }}
            />
            <motion.circle
              cx="50"
              cy="30"
              r="1.5"
              fill="#FFEB3B"
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: [0, -3, 0, 3, 0],
                y: [-3, -10, -15, -10, -3],
                opacity: [0, 0.7, 0.7, 0.7, 0],
                scale: [0.5, 1, 1.2, 1, 0.5],
              }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: 0.8,
              }}
            />
          </motion.g>
        ) : null}

        {/* Face */}
        <motion.g
          animate={{
            y: mood === "excited" || mood === "celebrate" ? [-1, 1, -1] : 0,
          }}
          transition={{
            duration: 0.8,
            repeat: mood === "excited" || mood === "celebrate" ? Number.POSITIVE_INFINITY : 0,
            repeatType: "reverse",
          }}
        >
          {/* Eyes */}
          <motion.g
            animate={{
              scaleY: mood === "excited" || mood === "celebrate" ? [1, 0.1, 1] : [1, 0.1, 1],
            }}
            transition={{
              duration: 0.3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              repeatDelay: mood === "excited" || mood === "celebrate" ? 1 : 4,
            }}
          >
            <circle cx="45" cy="60" r="3" fill="black" />
            <circle cx="55" cy="60" r="3" fill="black" />
          </motion.g>

          {/* Mouth with expressions */}
          <motion.path
            d="M45 65 Q50 70 55 65"
            stroke="black"
            strokeWidth="2"
            fill="transparent"
            animate={{
              d:
                mood === "celebrate" || mood === "dance"
                  ? "M45 65 Q50 73 55 65"
                  : mood === "excited"
                    ? "M45 65 Q50 70 55 65"
                    : "M45 65 Q50 68 55 65",
            }}
            transition={{
              duration: 0.4,
            }}
          />
        </motion.g>
      </svg>
    </motion.div>
  )
}

