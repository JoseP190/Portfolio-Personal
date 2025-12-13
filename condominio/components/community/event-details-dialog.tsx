"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

interface EventDetailsProps {
  event: {
    title: string
    date: string
    time: string
    location: string
    description: string
  }
}

export function EventDetailsDialog({ event }: EventDetailsProps) {
  const [open, setOpen] = useState(false)
  const [isRsvping, setIsRsvping] = useState(false)
  const { toast } = useToast()

  const handleRSVP = async () => {
    setIsRsvping(true)
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "RSVP Successful",
        description: `You've successfully RSVP'd to ${event.title}`,
      })

      setOpen(false)
    } catch (error) {
      toast({
        title: "RSVP Failed",
        description: "There was an error processing your RSVP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRsvping(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event.title}</DialogTitle>
          <DialogDescription>Event details and registration</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Date</div>
                <div className="text-sm text-muted-foreground">{event.date}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Time</div>
                <div className="text-sm text-muted-foreground">{event.time}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Location</div>
                <div className="text-sm text-muted-foreground">{event.location}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Attendees</div>
                <div className="text-sm text-muted-foreground">12 people are attending</div>
              </div>
            </div>
            <div className="pt-2">
              <div className="font-medium mb-1">Description</div>
              <div className="text-sm">{event.description}</div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button onClick={handleRSVP} disabled={isRsvping}>
            {isRsvping ? "Processing..." : "RSVP Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

