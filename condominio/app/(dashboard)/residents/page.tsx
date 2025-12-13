import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Mail, Phone } from "lucide-react"
import { AddResidentDialog } from "@/components/residents/add-resident-dialog"
import { ResidentActions } from "@/components/residents/resident-actions"

export default function ResidentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Residentes</h1>
          <p className="text-muted-foreground">Administra y visualiza todos los residentes del condominio.</p>
        </div>
        <AddResidentDialog />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Todos los Residentes</CardTitle>
              <CardDescription>Lista de todos los residentes con su información de contacto.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar residentes..." className="w-full pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-1 md:grid-cols-5 p-4 font-medium border-b">
              <div className="md:col-span-2">Nombre / Casa</div>
              <div className="hidden md:block">Contacto</div>
              <div className="hidden md:block">Estado</div>
              <div className="hidden md:block">Acciones</div>
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-5 p-4 border-b last:border-0 items-center gap-4 md:gap-0"
              >
                <div className="md:col-span-2">
                  <div className="font-medium">Juan Pérez {i + 1}</div>
                  <div className="text-sm text-muted-foreground">Casa {101 + i}</div>
                </div>
                <div className="flex flex-col text-sm">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span>juan.perez{i + 1}@ejemplo.com</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>+52 (555) 123-45{i}8</span>
                  </div>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      i % 3 === 0
                        ? "bg-green-100 text-green-800"
                        : i % 3 === 1
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {i % 3 === 0 ? "Propietario" : i % 3 === 1 ? "Inquilino" : "Familiar"}
                  </span>
                </div>
                <div>
                  <ResidentActions resident={{ name: `Juan Pérez ${i + 1}`, unit: `${101 + i}` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

