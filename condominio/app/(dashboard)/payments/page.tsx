import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Download, Filter, ArrowUpDown, CheckCircle2, AlertCircle, Clock } from "lucide-react"

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pagos</h1>
          <p className="text-muted-foreground">Seguimiento y gestión de todos los pagos del condominio.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button>Registrar Pago</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Recaudado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,563.00</div>
            <p className="text-xs text-muted-foreground">Para el mes actual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,395.00</div>
            <p className="text-xs text-muted-foreground">De 12 residentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pagos Vencidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,250.00</div>
            <p className="text-xs text-muted-foreground">De 3 residentes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Historial de Pagos</CardTitle>
              <CardDescription>Transacciones de pago recientes en el sistema.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar pagos..." className="w-full pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-1 md:grid-cols-6 p-4 font-medium border-b">
              <div className="md:col-span-2">Residente / Casa</div>
              <div className="hidden md:block">Monto</div>
              <div className="hidden md:block">Fecha</div>
              <div className="hidden md:block">Estado</div>
              <div className="hidden md:block">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <span>Tipo</span>
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-6 p-4 border-b last:border-0 items-center gap-4 md:gap-0"
              >
                <div className="md:col-span-2">
                  <div className="font-medium">Juan Pérez {i + 1}</div>
                  <div className="text-sm text-muted-foreground">Casa {101 + i}</div>
                </div>
                <div className="font-medium">${(350 + (i % 3) * 50).toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">{new Date(2023, 5, 20 - i).toLocaleDateString()}</div>
                <div>
                  {i % 3 === 0 ? (
                    <span className="inline-flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" /> Pagado
                    </span>
                  ) : i % 3 === 1 ? (
                    <span className="inline-flex items-center gap-1 text-sm text-yellow-600">
                      <Clock className="h-4 w-4" /> Pendiente
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" /> Vencido
                    </span>
                  )}
                </div>
                <div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      i % 4 === 0
                        ? "bg-blue-100 text-blue-800"
                        : i % 4 === 1
                          ? "bg-purple-100 text-purple-800"
                          : i % 4 === 2
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                    }`}
                  >
                    {i % 4 === 0
                      ? "Mantenimiento"
                      : i % 4 === 1
                        ? "Cuota Extraordinaria"
                        : i % 4 === 2
                          ? "Penalización"
                          : "Servicios"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

