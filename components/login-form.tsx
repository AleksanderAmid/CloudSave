"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TypewriterText } from "@/components/typewriter-text"

// Mock user check
const existingUsers = ["admin", "user1"]

export function LoginForm() {
  const router = useRouter()
  const [step, setStep] = useState("username")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isNewUser, setIsNewUser] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [descriptionText, setDescriptionText] = useState("Enter your username to begin")

  useEffect(() => {
    if (step === "password") {
      const newText = isNewUser ? `Create a password for ${username}` : `Enter password for ${username}`
      setDescriptionText(newText)
    } else {
      setDescriptionText("Enter your username to begin")
    }
  }, [step, username, isNewUser])

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim() === "") {
      setError("Username cannot be empty.")
      return
    }
    setError("")
    if (existingUsers.includes(username.toLowerCase())) {
      setIsNewUser(false)
    } else {
      setIsNewUser(true)
    }
    setStep("password")
  }

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isNewUser) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.")
        return
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long.")
        return
      }
    } else {
      // Mock password check
      if (password !== "password123") {
        setError("Invalid password.")
        return
      }
    }
    setError("")
    // On successful login/signup
    router.push("/dashboard")
  }

  return (
    <Card className="w-[380px] bg-black/50 backdrop-blur-lg border-gray-700 text-white shadow-2xl shadow-blue-500/10">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Welcome to CloudeSave
        </CardTitle>
        <CardDescription className="text-gray-400 h-6">
          <TypewriterText text={descriptionText} speed={30} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <motion.form onSubmit={step === "username" ? handleUsernameSubmit : handleFinalSubmit} className="space-y-4">
            {/* Username field - always fully visible */}
            <motion.div
              className="relative"
              animate={{
                opacity: step === "password" ? 0.8 : 1,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
              <Input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 focus:border-gray-700 focus:bg-white focus:text-black focus:placeholder:text-gray-600 transition-colors duration-200"
                disabled={step === "password"}
              />
            </motion.div>

            {/* Password fields - slide in from below */}
            <motion.div
              initial={{ height: 0, opacity: 0, y: 20 }}
              animate={{
                height: step === "password" ? "auto" : 0,
                opacity: step === "password" ? 1 : 0,
                y: step === "password" ? 0 : 20,
              }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden space-y-4"
            >
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 focus:border-gray-700 focus:bg-white focus:text-black focus:placeholder:text-gray-600 transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {isNewUser && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="relative overflow-hidden"
                >
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-0 focus:ring-offset-0 focus:border-gray-700 focus:bg-white focus:text-black focus:placeholder:text-gray-600 transition-colors duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </motion.div>
              )}
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              {step === "username" ? (
                <>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : isNewUser ? (
                "Choose Password & Sign In"
              ) : (
                "Sign In"
              )}
            </Button>

            {step === "password" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Button
                  variant="link"
                  size="sm"
                  className="text-gray-400"
                  onClick={() => setStep("username")}
                  type="button"
                >
                  Back to username
                </Button>
              </motion.div>
            )}
          </motion.form>
        </div>
      </CardContent>
    </Card>
  )
}
