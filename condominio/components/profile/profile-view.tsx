"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { UserCircle, Mail, Phone, Home, Briefcase } from "lucide-react"

// Mock user data - in a real app, this would come from an API or auth context
const initialUserData = {
  name: "Juan Pérez",
  email: "juan.perez@example.com",
  phone: "+52 (555) 123-4567",
  unit: "301",
  role: "resident",
  bio: "I've been living in Lomas del Mar for 5 years and I love our community!",
}

export function ProfileView() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState(initialUserData)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this data to an API
    console.log("Saving profile data:", userData)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    })
    setIsEditing(false)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Profile Information</CardTitle>
        <CardDescription>View and manage your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <div className="flex items-center space-x-4">
              <UserCircle className="h-12 w-12 text-gray-400" />
              <div>
                <h2 className="text-xl font-semibold">{userData.name}</h2>
                <p className="text-sm text-muted-foreground">{userData.role}</p>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                {isEditing ? (
                  <Input id="name" name="name" value={userData.name} onChange={handleInputChange} required />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <UserCircle className="h-4 w-4 text-muted-foreground" />
                    <span>{userData.name}</span>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    required
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{userData.email}</span>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input id="phone" name="phone" value={userData.phone} onChange={handleInputChange} required />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{userData.phone}</span>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit">Unit</Label>
                {isEditing ? (
                  <Input id="unit" name="unit" value={userData.unit} onChange={handleInputChange} required />
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span>{userData.unit}</span>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                {isEditing ? (
                  <Select value={userData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resident">Resident</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center space-x-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{userData.role}</span>
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea id="bio" name="bio" value={userData.bio} onChange={handleInputChange} rows={4} />
                ) : (
                  <div className="text-sm">{userData.bio}</div>
                )}
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-4">
        {isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save Changes</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </CardFooter>
    </Card>
  )
}

