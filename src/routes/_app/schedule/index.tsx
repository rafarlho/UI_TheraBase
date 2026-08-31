import { EventCalendar } from '#/components/reui/event-calendar/event-calendar'
import type{ EventCalendarApi } from '#/components/reui/event-calendar/event-calendar'
import { EventCalendarContent } from '#/components/reui/event-calendar/event-calendar-content'
import { EventCalendarDatePicker, EventCalendarNav, EventCalendarToolbar } from '#/components/reui/event-calendar/event-calendar-nav'
import type { CalendarEvent, EventCalendarOccurrence } from '#/components/reui/event-calendar/event-calendar-types'
import CreateDialog from '#/components/schedule/create-dialog'
import { Button } from '#/components/ui/button'
import type { AppointmentWithPerson } from '#/entities/appointment.entity'
import { getByTherapistAndDate, updateAppointment } from '#/server/functions/appointments'
import { getPatientOptions } from '#/server/functions/persons'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { addMinutes, differenceInMinutes, isEqual } from 'date-fns'
import { CalendarX2, ClipboardClock, MapPin, PlusIcon, SquareCheckBig } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { pt } from "date-fns/locale"
import { ptI18n } from '#/utils/calendar-portuguese'
import { Badge } from '#/components/ui/badge'

const therapistId = "acf18675-88c0-4b6b-a880-b9f73400a2f0"
export const Route = createFileRoute('/_app/schedule/')({
  component: RouteComponent,
  loader: async () => {
    const [appointementsLoaded, patientsLoaded] = await Promise.all([
      getByTherapistAndDate({data:{therapistId, startDate: new Date(), endDate: new Date()}}),
      getPatientOptions({data:{therapistId}})
    ])
    return {appointementsLoaded, patientsLoaded}
  }
})

function RouteComponent() {
  const {appointementsLoaded, patientsLoaded} = Route.useLoaderData()

  const [appointements, setAppointments] = useState<CalendarEvent<AppointmentWithPerson>[]>([])
  const [openCreateDialog, setOpenCreateDialog] = useState(false)

  const updateAppointementFn = useServerFn(updateAppointment)
  const getByTherapistAndDateFn = useServerFn(getByTherapistAndDate)

  const apiRef = useRef<EventCalendarApi<AppointmentWithPerson> | null>(null)

  useEffect(()=> setAppointments(appointementsLoaded.map(a => parseAppointmentToCalendarEvent(a))),[appointementsLoaded])


  async function handleEventChange(events:CalendarEvent<AppointmentWithPerson>[]) {
      const changedEvents = events.filter(e => !appointements.find((a) => isEqual(a.start, e.start) && isEqual(a.end, e.end) && a.id === e.id))
      changedEvents.map(async e => {
        await updateAppointementFn({data:{
          id: e.id,
          date: new Date(e.start),
          duration: differenceInMinutes(e.end, e.start)
        }})
      })
      await getAppointmentsByRange()
  }


  async function getAppointmentsByRange() {
    const {start, end} = apiRef.current!.getActiveRange()
    const appointments = await getByTherapistAndDateFn({data:{
      therapistId,
      startDate: new Date(start),
      endDate: new Date(end),
    }})
    setAppointments(appointments.map(a => parseAppointmentToCalendarEvent(a)))
  }

  return (
    <>
      <CreateDialog open={openCreateDialog} setOpen={setOpenCreateDialog} patientOptions={patientsLoaded} refreshData={getAppointmentsByRange}/>
      <div className='h-dvh p-5 flex flex-col min-w-0 overflow-hidden gap-3 w-full'>
        <h1 className='font-heading font-bold text-2xl'> Agenda</h1>
        <EventCalendar
          locale={pt}
          i18n={ptI18n}
          events={appointements}
          onEventClick={(e: any)=>console.log(e)}
          onEventsChange={handleEventChange}
          onDateChange={getAppointmentsByRange}
          onViewChange={getAppointmentsByRange}
          apiRef={apiRef}
          interactions={{
            drag: false,
            resize: false,
            selectSlot: true,
          }}
          defaultView="day"
          className="h-full w-full"
          renderEvent={(props) => renderCalendarEvent(props.occurrence, props.view)}
        >
          <div className='flex justify-between'>
            <EventCalendarNav className="min-w-0">
            </EventCalendarNav>
            <EventCalendarToolbar>
              <EventCalendarDatePicker/>
              <Button size="sm" onClick={()=> setOpenCreateDialog(true)}>
                <PlusIcon  className="size-4" aria-hidden="true" />
                Nova marcação
              </Button>
            </EventCalendarToolbar>
          </div>
          <EventCalendarContent/>
        </EventCalendar>
      </div>
    </>
  )
}

function renderCalendarEvent(occurrence: EventCalendarOccurrence<AppointmentWithPerson>, view: string){
  const statusLabels: Record<AppointmentWithPerson["status"], {name: string, icon:React.ReactElement}> = {
    not_started:{name: 'Por iniciar', icon:<ClipboardClock/> },
    canceled: {name: 'Cancelada', icon:<CalendarX2/> },
    finished: {name: 'Terminada', icon:<SquareCheckBig/> },
  }
  const appointment = occurrence.event.data
  return <div className='flex flex-row justify-between py-1 w-full overflow-hidden'>
      <div className='flex flex-col'>

      <span className="font-medium truncate">{appointment!.therapistPerson.person.name}</span>
      {view !== "month" && (
        <>
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground truncate">
            <MapPin className="size-3 shrink-0" />
            {appointment!.location}
          </span>
        </>
      )}
      </div>
      <Badge className="w-fit text-[10px]" variant={appointment?.status === 'not_started' ? 'secondary' : appointment?.status === 'canceled' ? "destructive" : 'default'}>
        {statusLabels[appointment!.status].icon}
        {view !== "month" && view !== "week" && statusLabels[appointment!.status].name}
      </Badge>
      
  </div>
}

function parseAppointmentToCalendarEvent(appointment: AppointmentWithPerson): CalendarEvent<AppointmentWithPerson> {
  return {
    id: appointment.id,
    data: appointment,
    start: appointment.date,
    end: addMinutes(appointment.date, appointment.duration),
    title: appointment.therapistPerson.person.name,
  }
}

