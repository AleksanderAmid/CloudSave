import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <DashboardSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-auto">{children}</main>
    </div>
  )
}
