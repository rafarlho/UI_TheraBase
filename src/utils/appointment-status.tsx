import type { AppointmentWithPerson } from "#/entities/appointment.entity";
import { CalendarX2, ClipboardClock, SquareCheckBig } from "lucide-react";

export const statusLabels: Record<AppointmentWithPerson["status"], {name: string, icon:React.ReactElement}> = {
    not_started:{name: 'Por iniciar', icon:<ClipboardClock /> },
    canceled: {name: 'Cancelada', icon:<CalendarX2/> },
    finished: {name: 'Terminada', icon:<SquareCheckBig/> },
}