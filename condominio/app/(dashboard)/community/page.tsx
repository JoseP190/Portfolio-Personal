import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageSquare } from "lucide-react"
import { AddEventDialog } from "@/components/community/add-event-dialog"
import { ViewCalendarDialog } from "@/components/community/view-calendar-dialog"
import { EventDetailsDialog } from "@/components/community/event-details-dialog"

export default function CommunityPage() {
  // Sample events data
  const events = [
    {
      title: "Annual Residents Meeting",
      date: "June 25, 2023",
      time: "7:00 PM - 9:00 PM",
      location: "Community Hall",
      description: "Annual meeting to discuss budget, maintenance plans, and elect new board members.",
    },
    {
      title: "Summer Pool Party",
      date: "July 4, 2023",
      time: "2:00 PM - 6:00 PM",
      location: "Pool Area",
      description: "Join us for food, drinks, and fun at our annual summer pool party.",
    },
    {
      title: "Gardening Workshop",
      date: "July 15, 2023",
      time: "10:00 AM - 12:00 PM",
      location: "Community Garden",
      description: "Learn tips and tricks for maintaining your balcony garden.",
    },
    {
      title: "Movie Night",
      date: "July 22, 2023",
      time: "8:00 PM - 10:30 PM",
      location: "Community Hall",
      description: "Family-friendly movie night with popcorn and refreshments.",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community</h1>
          <p className="text-muted-foreground">Connect with your neighbors and stay updated on community events.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <ViewCalendarDialog />
          <AddEventDialog />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Community events scheduled in the coming weeks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-lg">{event.title}</div>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Calendar className="h-4 w-4" />
                      <span className="sr-only">Add to calendar</span>
                    </Button>
                  </div>
                  <div className="flex flex-col text-sm text-muted-foreground">
                    <div>
                      {event.date} • {event.time}
                    </div>
                    <div>{event.location}</div>
                  </div>
                  <p className="text-sm mt-2">{event.description}</p>
                  <div className="flex justify-end gap-2 mt-2">
                    <EventDetailsDialog event={event} />
                    <Button size="sm">RSVP</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Forum</CardTitle>
              <CardDescription>Recent discussions in the community forum.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "Recommendations for local plumbers?",
                    author: "John Doe",
                    replies: 8,
                    lastActivity: "2 hours ago",
                  },
                  {
                    title: "Lost cat - please help!",
                    author: "Jane Smith",
                    replies: 12,
                    lastActivity: "5 hours ago",
                  },
                  {
                    title: "Parking issues on weekends",
                    author: "Mike Johnson",
                    replies: 15,
                    lastActivity: "1 day ago",
                  },
                  {
                    title: "New restaurant opening nearby",
                    author: "Sarah Williams",
                    replies: 6,
                    lastActivity: "2 days ago",
                  },
                ].map((topic, i) => (
                  <div key={i} className="flex justify-between items-center p-3 border rounded-lg">
                    <div className="flex flex-col">
                      <div className="font-medium">{topic.title}</div>
                      <div className="text-sm text-muted-foreground">Posted by {topic.author}</div>
                    </div>
                    <div className="flex flex-col items-end text-sm">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span\

