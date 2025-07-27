"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, BarChart, UserCircle, LogOut, UploadCloud } from "lucide-react"
import { StorageMeter } from "./storage-meter"
import { UploadModal } from "./upload-modal"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "My Files", icon: Home },
  { href: "/dashboard/settings", label: "Admin Dashboard", icon: BarChart },
  { href: "/dashboard/settings/users", label: "User Management", icon: Users },
  { href: "/dashboard/settings/profile", label: "Profile", icon: UserCircle },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  return (
    <>
      <aside className="w-64 flex-shrink-0 bg-gray-950/70 backdrop-blur-sm border-r border-gray-800 flex flex-col p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <h1 className="text-xl font-bold">CloudeSave</h1>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-6" onClick={() => setIsUploadModalOpen(true)}>
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload File
        </Button>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800",
                pathname === item.href && "bg-blue-900/50 text-white",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="mb-4">
            <StorageMeter used={65} total={100} />
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-400 transition-all hover:text-white hover:bg-gray-800"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Link>
        </div>
      </aside>

      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
    </>
  )
}
