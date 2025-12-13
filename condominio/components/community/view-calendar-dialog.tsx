"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function ViewCalendarDialog() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  // Sample calendar events
  const events = [
    {
      id: 1,
      title: "Annual Residents Meeting",
      date: "2023-06-25",
      time: "19:00 - 21:00",
      location: "Community Hall",
    },
    {
      id: 2,
      title: "Summer Pool Party",
      date: "2023-07-04",
      time: "14:00 - 18:00",
      location: "Pool Area",
    },
    {
      id: 3,
      title: "Gardening Workshop",
      date: "2023-07-15",
      time: "10:00 - 12:00",
      location: "Community Garden",
    },
    {
      id: 4,
      title: "Movie Night",
      date: "2023-07-22",
      time: "20:00 - 22:30",
      location: "Community Hall",
    },
    {
      id: 5,
      title: "Board Game Night",
      date: "2023-07-29",
      time: "18:00 - 21:00",
      location: "Community Hall",
    },
  ]

  // Group events by date
  const eventsByDate = events.reduce(
    (acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = []
      }
      acc[event.date].push(event)
      return acc
    },
    {} as Record<string, typeof events>,
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Calendar className="mr-2 h-4 w-4" />
          View Calendar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Community Calendar</DialogTitle>
          <DialogDescription>View all upcoming community events.</DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {Object.keys(eventsByDate)
            .sort()
            .map((date) => (
              <div key={date} className="mb-6">
                <h3 className="font-medium text-lg mb-2">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <div className="space-y-3">
                  {eventsByDate[date].map((event) => (
                    <div key={event.id} className="border rounded-md p-3">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">{event.time}</div>
                      <div className="text-sm text-muted-foreground">{event.location}</div>
                      <div className="flex justify-end mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "RSVP Successful",
                              description: `You've RSVP'd to ${event.title}`,
                            })
                          }}
                        >
                          RSVP
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

