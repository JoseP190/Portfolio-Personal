import { redirect } from "next/navigation"

export default function Home() {
  // In a real app, check authentication status here
  // For now, redirect to login page
  redirect("/login")
}

