import type React from "react"
import { MainNav } from "@/components/layout/main-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 p-4 md:p-8">{children}</div>
    </div>
  )
}

