import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, Shield, ArrowUpRight, ArrowDownRight, DollarSign, AlertTriangle } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Administrador</h1>
        <p className="text-muted-foreground">Bienvenido al panel de administración de Lomas del Mar.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Residentes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +2.5%
              </span>{" "}
              desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,563</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +5.2%
              </span>{" "}
              desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,395</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500 inline-flex items-center">
                <ArrowDownRight className="mr-1 h-3 w-3" />
                +12.3%
              </span>{" "}
              desde el mes pasado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidentes de Seguridad</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 inline-flex items-center">
                <ArrowDownRight className="mr-1 h-3 w-3" />
                -50%
              </span>{" "}
              desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pagos Recientes</CardTitle>
            <CardDescription>Resumen de los pagos más recientes en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <div className="font-medium">Casa {101 + i}</div>
                    <div className="text-sm text-muted-foreground">Juan Pérez</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium">${(1200 + i * 50).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(2023, 5, 15 - i).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Reportes Recientes</CardTitle>
            <CardDescription>Últimos reportes de mantenimiento e incidencias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-2 border-b pb-2">
                  <AlertTriangle
                    className={`h-5 w-5 ${i === 0 ? "text-red-500" : i === 1 ? "text-yellow-500" : "text-blue-500"}`}
                  />
                  <div>
                    <div className="font-medium">
                      {i === 0
                        ? "Fuga de Agua"
                        : i === 1
                          ? "Mantenimiento de Elevador"
                          : i === 2
                            ? "Queja por Ruido"
                            : "Problema de Estacionamiento"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Casa {i === 0 ? "203" : i === 1 ? "Todos" : i === 2 ? "305" : "Estacionamiento B"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(2023, 5, 18 - i).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

