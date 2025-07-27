import { LoginForm } from "@/components/login-form"
import { AnimatedBackground } from "@/components/animated-background"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <AnimatedBackground />
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}
