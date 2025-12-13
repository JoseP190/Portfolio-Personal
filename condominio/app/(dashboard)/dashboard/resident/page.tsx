import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, CreditCard, FileText, Calendar, CheckCircle2, AlertCircle } from "lucide-react"

export default function ResidentDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Panel de Residente</h1>
        <p className="text-muted-foreground">
          Bienvenido de nuevo, Juan Pérez. Esto es lo que está sucediendo en tu condominio.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tu Saldo</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$350.00</div>
            <p className="text-xs text-muted-foreground">Vence el 30 de junio, 2023</p>
            <Button className="mt-4 w-full" size="sm">
              Pagar Ahora
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitudes de Mantenimiento</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 en progreso, 1 pendiente</p>
            <Button variant="outline" className="mt-4 w-full" size="sm">
              Ver Solicitudes
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Comunitarios</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Próximos este mes</p>
            <Button variant="outline" className="mt-4 w-full" size="sm">
              Ver Calendario
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Anuncios</CardTitle>
            <CardDescription>Últimas actualizaciones de la administración</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Mantenimiento de Piscina",
                  date: "15 de junio, 2023",
                  description: "La piscina estará cerrada por mantenimiento de 10 AM a 2 PM.",
                },
                {
                  title: "Reunión Anual",
                  date: "25 de junio, 2023",
                  description: "Reunión anual de residentes en el salón comunitario a las 7 PM.",
                },
                {
                  title: "Nuevo Sistema de Seguridad",
                  date: "10 de junio, 2023",
                  description:
                    "Instalación del nuevo sistema de seguridad completada. Por favor recoge tus nuevas tarjetas de acceso.",
                },
              ].map((announcement, i) => (
                <div key={i} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <Bell className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{announcement.title}</h4>
                      <span className="text-xs text-muted-foreground">{announcement.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{announcement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Pagos</CardTitle>
            <CardDescription>Tu actividad de pagos reciente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  amount: "$350.00",
                  date: "30 de mayo, 2023",
                  status: "Pagado",
                  description: "Cuota mensual de mantenimiento",
                },
                {
                  amount: "$350.00",
                  date: "30 de abril, 2023",
                  status: "Pagado",
                  description: "Cuota mensual de mantenimiento",
                },
                {
                  amount: "$150.00",
                  date: "15 de abril, 2023",
                  status: "Pagado",
                  description: "Cuota extraordinaria",
                },
                {
                  amount: "$350.00",
                  date: "30 de marzo, 2023",
                  status: "Pagado",
                  description: "Cuota mensual de mantenimiento",
                },
              ].map((payment, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    {payment.status === "Pagado" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <div>
                      <div className="font-medium">{payment.amount}</div>
                      <div className="text-xs text-muted-foreground">{payment.description}</div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">{payment.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

