"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const fileNames = [
  "my_dog.png",
  "vacation_2024.jpg",
  "project_final.pdf",
  "birthday_party.mp4",
  "resume_updated.docx",
  "music_playlist.mp3",
  "screenshot_001.png",
]

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 })
  const [isFlickering, setIsFlickering] = useState(false)
  const [currentFileName, setCurrentFileName] = useState("")
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    // Animate the flashlight position
    const animateFlashlight = () => {
      const newX = Math.random() * 100
      const newY = Math.random() * 100

      // Start moving
      setIsMoving(true)
      setTargetPosition({ x: newX, y: newY })

      // Select a new random file name for this position
      const randomFileName = fileNames[Math.floor(Math.random() * fileNames.length)]
      setCurrentFileName(randomFileName)

      // Random flicker effect
      if (Math.random() < 0.4) {
        setIsFlickering(true)
        setTimeout(() => setIsFlickering(false), 200)
      }
    }

    const interval = setInterval(animateFlashlight, 3000 + Math.random() * 2000)
    return () => clearInterval(interval)
  }, [])

  // Update actual position with animation
  useEffect(() => {
    const animatePosition = () => {
      setMousePosition(targetPosition)
      // Stop moving after animation completes
      setTimeout(() => setIsMoving(false), 2000)
    }

    animatePosition()
  }, [targetPosition])

  return (
    <div className="absolute inset-0 z-0">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      {/* Single file name - positioned at the center of the flashlight */}
      <motion.div
        className="absolute pointer-events-none select-none"
        style={{
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: "translate(-50%, -50%)",
          zIndex: 1,
        }}
        animate={{
          opacity: isMoving ? 0 : isFlickering ? 0.4 : 1,
        }}
        transition={{
          opacity: { duration: isMoving ? 0.5 : 1.5, ease: "easeInOut" },
        }}
      >
        <div
          className="font-mono whitespace-nowrap"
          style={{
            fontSize: "16px",
            color: "#ffffff",
            textShadow: "0 0 12px rgba(255,255,255,0.9), 0 0 24px rgba(59,130,246,0.6)",
            fontWeight: "600",
          }}
        >
          {currentFileName}
        </div>
      </motion.div>

      {/* Main flashlight effect - positioned above file names */}
      <motion.div
        className="absolute inset-0"
        style={{ zIndex: 2 }}
        animate={{
          background: `radial-gradient(circle 500px at ${mousePosition.x}% ${mousePosition.y}%, ${
            isFlickering ? "rgba(62, 62, 62, 0.3)" : "rgba(62, 62, 62, 0.6)"
          }, transparent)`,
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      />

      {/* Secondary light effect for better illumination */}
      <motion.div
        className="absolute inset-0"
        style={{ zIndex: 3 }}
        animate={{
          background: `radial-gradient(circle 300px at ${mousePosition.x}% ${mousePosition.y}%, ${
            isFlickering ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.2)"
          }, transparent)`,
          opacity: isFlickering ? [1, 0.2, 1, 0.4, 1] : 1,
        }}
        transition={{
          duration: isFlickering ? 0.2 : 2,
          times: isFlickering ? [0, 0.25, 0.5, 0.75, 1] : undefined,
          ease: "easeInOut",
        }}
      />

      {/* Bright center spotlight */}
      <motion.div
        className="absolute inset-0"
        style={{ zIndex: 4 }}
        animate={{
          background: `radial-gradient(circle 150px at ${mousePosition.x}% ${mousePosition.y}%, ${
            isFlickering ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.1)"
          }, transparent)`,
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
        }}
      />
    </div>
  )
}
