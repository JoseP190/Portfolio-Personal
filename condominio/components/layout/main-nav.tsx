"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  Home,
  Users,
  CreditCard,
  FileBarChart,
  Shield,
  Users2,
  Settings,
  Menu,
  X,
  UserCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Residents",
    href: "/residents",
    icon: Users,
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileBarChart,
  },
  {
    title: "Security",
    href: "/security",
    icon: Shield,
  },
  {
    title: "Community",
    href: "/community",
    icon: Users2,
  },
  {
    title: "Admin Panel",
    href: "/admin",
    icon: Settings,
    adminOnly: true,
  },
]

interface MainNavProps {
  userRole?: "admin" | "resident"
}

export function MainNav({ userRole = "resident" }: MainNavProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const filteredNavItems = navItems.filter((item) => !item.adminOnly || userRole === "admin")

  return (
    <>
      <div className="hidden md:flex h-16 items-center px-4 border-b bg-background">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Building2 className="h-6 w-6 text-primary" />
          <span>Lomas del Mar</span>
        </Link>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          {filteredNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild className="flex items-center">
            <Link href="/profile">
              <UserCircle className="h-4 w-4 mr-2" />
              <span>Profile</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Sign Out</Link>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 border-b bg-background">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Building2 className="h-6 w-6 text-primary" />
          <span>Lomas del Mar</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background animate-in">
          <nav className="flex flex-col p-4">
            {filteredNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center py-3 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.title}
              </Link>
            ))}
            <div className="mt-6 flex flex-col space-y-3">
              <Button variant="ghost" asChild>
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                  <UserCircle className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign Out
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

