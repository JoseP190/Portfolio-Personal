import { ProfileView } from "@/components/profile/profile-view"

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">View and edit your profile information.</p>
      </div>
      <ProfileView />
    </div>
  )
}

