import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { AddReportForm } from "@/components/reports/add-report-form"

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">View and manage maintenance requests and incident reports.</p>
        </div>
        <AddReportForm />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">In the last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Awaiting resolution</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground">In the last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>Maintenance requests and incident reports from residents.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search reports..." className="w-full pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-1 md:grid-cols-5 p-4 font-medium border-b">
              <div className="md:col-span-2">Title / Description</div>
              <div className="hidden md:block">Reported By</div>
              <div className="hidden md:block">Date</div>
              <div className="hidden md:block">Status</div>
            </div>
            {[
              {
                title: "Water Leak",
                description: "Water leaking from ceiling in bathroom",
                unit: "203",
                status: "Open",
              },
              {
                title: "Broken Window",
                description: "Window cracked in living room",
                unit: "105",
                status: "In Progress",
              },
              {
                title: "Elevator Maintenance",
                description: "Elevator making strange noise",
                unit: "All",
                status: "Scheduled",
              },
              {
                title: "Noise Complaint",
                description: "Loud music after quiet hours",
                unit: "305",
                status: "Resolved",
              },
              {
                title: "Parking Issue",
                description: "Unauthorized vehicle in resident spot",
                unit: "Parking B",
                status: "Resolved",
              },
              { title: "Plumbing Problem", description: "Sink draining slowly", unit: "402", status: "Open" },
              { title: "HVAC Repair", description: "Air conditioning not working", unit: "207", status: "In Progress" },
              {
                title: "Security Concern",
                description: "Main door not locking properly",
                unit: "Entrance",
                status: "Urgent",
              },
            ].map((report, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-5 p-4 border-b last:border-0 items-center gap-4 md:gap-0"
              >
                <div className="md:col-span-2">
                  <div className="font-medium">{report.title}</div>
                  <div className="text-sm text-muted-foreground">{report.description}</div>
                </div>
                <div>
                  <div className="text-sm">Unit {report.unit}</div>
                </div>
                <div className="text-sm text-muted-foreground">{new Date(2023, 5, 20 - i).toLocaleDateString()}</div>
                <div>
                  {report.status === "Open" ? (
                    <span className="inline-flex items-center gap-1 text-sm text-yellow-600">
                      <AlertCircle className="h-4 w-4" /> Open
                    </span>
                  ) : report.status === "In Progress" ? (
                    <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                      <Clock className="h-4 w-4" /> In Progress
                    </span>
                  ) : report.status === "Urgent" ? (
                    <span className="inline-flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" /> Urgent
                    </span>
                  ) : report.status === "Scheduled" ? (
                    <span className="inline-flex items-center gap-1 text-sm text-purple-600">
                      <Clock className="h-4 w-4" /> Scheduled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" /> Resolved
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

