import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, UserCheck, AlertTriangle, Clock } from "lucide-react"
import { SecurityReportDialog } from "@/components/security/security-report-dialog"
import { IncidentReportDialog } from "@/components/security/incident-report-dialog"

export default function SecurityPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security</h1>
          <p className="text-muted-foreground">Monitor security incidents and access logs.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <SecurityReportDialog />
          <IncidentReportDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Access Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">In the last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Visitor Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">In the last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Security Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">In the last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Access Logs</CardTitle>
              <CardDescription>Recent building access events.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search logs..." className="w-full pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-1 md:grid-cols-5 p-4 font-medium border-b">
              <div className="md:col-span-2">Person / ID</div>
              <div className="hidden md:block">Location</div>
              <div className="hidden md:block">Time</div>
              <div className="hidden md:block">Type</div>
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-5 p-4 border-b last:border-0 items-center gap-4 md:gap-0"
              >
                <div className="md:col-span-2">
                  <div className="font-medium">
                    {i % 3 === 0 ? "John Doe" : i % 3 === 1 ? "Jane Smith" : "Visitor #" + (i + 1001)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {i % 3 === 0
                      ? "Resident ID: R-1001"
                      : i % 3 === 1
                        ? "Resident ID: R-1002"
                        : "Visitor Pass: V-" + (i + 1001)}
                  </div>
                </div>
                <div>
                  {i % 4 === 0 ? "Main Entrance" : i % 4 === 1 ? "Garage Gate" : i % 4 === 2 ? "Pool Area" : "Gym"}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(
                    2023,
                    5,
                    20,
                    Math.floor(Math.random() * 24),
                    Math.floor(Math.random() * 60),
                  ).toLocaleTimeString()}{" "}
                  - {new Date(2023, 5, 20).toLocaleDateString()}
                </div>
                <div>
                  {i % 3 === 0 ? (
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <UserCheck className="h-4 w-4" /> Entry
                    </span>
                  ) : i % 3 === 1 ? (
                    <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                      <Clock className="h-4 w-4" /> Exit
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-yellow-600">
                      <AlertTriangle className="h-4 w-4" /> Access Denied
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

