import { Badge } from '#/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import type { AppointmentWithPerson } from '#/entities/appointment.entity'
import { getAllAppointmentsForPatient, getByTherapistAndDate } from '#/server/functions/appointments'
import { getCurrentSession } from '#/server/functions/auth'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { endOfWeek, format, isAfter, isBefore, isSameDay, startOfWeek } from 'date-fns'
import { pt } from "date-fns/locale"
import { Calendar, CalendarX, CalendarX2, CheckSquareIcon, ClipboardClock, Clock, SquareCheckBig } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_app/dashboard')({
  component: RouteComponent,
  loader: async () => {
    const [weekAppointments,session] = await Promise.all([
      getByTherapistAndDate({data: {startDate: startOfWeek(new Date()), endDate: endOfWeek(new Date())}}),
      getCurrentSession(),
    ])
    return { weekAppointments, session}
  }
})

function RouteComponent() {

  const { weekAppointments, session} = Route.useLoaderData()
  const weeksPatientsMap = new Map()
  weekAppointments.forEach(a => {
    weeksPatientsMap.set(a.therapistPerson.person.id, a.therapistPerson.person)
  })
  const weeksPatients = Array.from(weeksPatientsMap.values())

  const getAllAppointmentsForPatientFn = useServerFn(getAllAppointmentsForPatient)

  const navigate = useNavigate()

  const todaysAppointments = weekAppointments.filter(a => isSameDay(new Date(), a.date))
  const weekStatus = [
    {
      title: "Nº consultas",
      icon: <Calendar/>,
      value: weekAppointments.length
    },
    {
      title: "Realizadas",
      icon: <CheckSquareIcon/>,
      value: weekAppointments.filter(a=> a.status === "finished").length
    },
    {
      title: "Por fazer",
      icon: <Clock/>,
      value: weekAppointments.filter(a=> a.status === "not_started").length
    },
    {
      title: "Canceladas",
      icon: <CalendarX/>,
      value: weekAppointments.filter(a=> a.status === "canceled").length
    },
  ]

  async function navigateToPatient(id: string) {
    const allAppointment = await getAllAppointmentsForPatientFn({data:{id}})
    const finishedAppointments = allAppointment.filter(a => a.status === "finished" && isBefore(a.date, new Date()))
    const toAttendAppointments = allAppointment.filter(a => a.status === "not_started" && isAfter(a.date, new Date()))
    if(finishedAppointments.length) navigate({to: `/schedule/${finishedAppointments[finishedAppointments.length-1].id}` })
    else if(toAttendAppointments.length) navigate({to: `/schedule/${toAttendAppointments[toAttendAppointments.length-1].id}` })
    else toast.info("Não existem consultas para o paciente selecionado")
  }

  return <main className="h-dvh w-full p-10 flex flex-col ">
    <h1 className='font-heading text-3xl font-bold'>Olá, {session?.name.split(" ")[0]}!</h1>
    <span className="text-xl">{format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", {locale: pt})}</span>
    
    <div className="mt-10">
      <h3 className="font-bold text-2xl" >Resumo da semana</h3>
      <div className='flex flex-wrap gap-10 justify-center mt-10'>
        {weekStatus.map((ws,_i) => (
          <Card key={_i} className='w-50'>
            <CardHeader >
              <CardTitle className='flex justify-between'>{ws.title} {ws.icon}</CardTitle>
            </CardHeader>
            <CardContent className='text-4xl'>{ws.value}</CardContent>  
          </Card>
          ))}
      </div>
    </div>
    <div className='grid grid-cols-3 gap-3 mt-10 flex-1 min-h-100'>
      <Card className='col-span-2 min-h-0 flex flex-col'>
        <CardHeader><CardTitle>Consultas de hoje ({todaysAppointments.length})</CardTitle></CardHeader>
        <CardContent className="overflow-auto min-h-0 flex-1">
          {todaysAppointments.map((a,_i) => (
            <div 
              key={_i} 
              className='grid grid-cols-[auto_70%_1fr] gap-5  p-5 cursor-pointer hover:bg-background/20 border rounded-md' 
              onClick={()=> navigate({to: `/schedule/${a.id}` })}
            >
              <span>{format(a.date,"HH:mm")}</span>
              <span>{a.therapistPerson.person.name} ({a.location})</span>
              <Badge className="w-fit text-[10px] justify-self-end" variant={a.status === 'not_started' ? 'secondary' : a.status === 'canceled' ? "destructive" : 'default'}>
                {statusLabels[a.status].icon}
                {statusLabels[a.status].name}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="min-h-0 flex flex-col">
        <CardHeader><CardTitle>Os teus pacientes da semana</CardTitle></CardHeader>
        <CardContent className="overflow-auto min-h-0 flex-1">
          <ul>
            {weeksPatients.map((p,_i)=>(
              <li 
                key={_i} 
                className="bg-primary/20 p-2 rounded-sm my-1"
                onClick={()=> navigateToPatient(p.id)}
              >{p.name}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>

  </main>
}

const statusLabels: Record<AppointmentWithPerson["status"], {name: string, icon:React.ReactElement}> = {
    not_started:{name: 'Por iniciar', icon:<ClipboardClock/> },
    canceled: {name: 'Cancelada', icon:<CalendarX2/> },
    finished: {name: 'Terminada', icon:<SquareCheckBig/> },
  }