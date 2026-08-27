import { EventCalendar } from '#/components/reui/event-calendar/event-calendar'
import type{ EventCalendarApi } from '#/components/reui/event-calendar/event-calendar'
import { EventCalendarContent } from '#/components/reui/event-calendar/event-calendar-content'
import { EventCalendarNav, EventCalendarToolbar } from '#/components/reui/event-calendar/event-calendar-nav'
import type { CalendarEvent, CalendarView } from '#/components/reui/event-calendar/event-calendar-types'
import CreateDialog from '#/components/schedule/create-dialog'
import { Button } from '#/components/ui/button'
import type { AppointmentWithPerson } from '#/entities/appointment.entity'
import { getByTherapistAndDate, updateAppointment } from '#/server/functions/appointments'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { addMinutes, differenceInMinutes, isEqual } from 'date-fns'
import { PlusIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const therapistId = "acf18675-88c0-4b6b-a880-b9f73400a2f0"
export const Route = createFileRoute('/_app/schedule')({
  component: RouteComponent,
  loader: async () => {
    return getByTherapistAndDate({data:{therapistId, startDate: new Date(), endDate: new Date()}})
  }
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()

  const [appointements, setAppointments] = useState<CalendarEvent<AppointmentWithPerson>[]>([])
  const [openCreateDialog, setOpenCreateDialog] = useState(false)

  const updateAppointementFn = useServerFn(updateAppointment)
  const getByTherapistAndDateFn = useServerFn(getByTherapistAndDate)

  const apiRef = useRef<EventCalendarApi<AppointmentWithPerson> | null>(null)

  useEffect(()=> setAppointments(loaderData.map(a => parseAppointmentToCalendarEvent(a))),[loaderData])

  useEffect(()=>console.log(appointements),[appointements])

  async function handleEventChange(events:CalendarEvent<AppointmentWithPerson>[]) {
      const changedEvents = events.filter(e => !appointements.find((a) => isEqual(a.start, e.start) && isEqual(a.end, e.end) && a.id === e.id))
      changedEvents.map(async e => {
        await updateAppointementFn({data:{
          id: e.id,
          date: new Date(e.start),
          duration: differenceInMinutes(e.end, e.start)
        }})
      })
      const {start, end} = apiRef.current!.getActiveRange()
      await getAppointmentsByRange(start, end)
  }

  async function handleViewChange(view: CalendarView) {
    const {start, end} = apiRef.current!.getActiveRange()
      await getAppointmentsByRange(start, end)
  }

  async function getAppointmentsByRange(startDate: Date, endDate: Date) {
    const appointments = await getByTherapistAndDateFn({data:{
      therapistId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    }})
    setAppointments(appointments.map(a => parseAppointmentToCalendarEvent(a)))
  }

  return (
    <>
      <CreateDialog open={openCreateDialog} setOpen={setOpenCreateDialog}/>
      <div className='h-dvh p-5 flex flex-col min-w-0 overflow-hidden gap-3 w-full'>
        <h1 className='font-heading font-bold text-2xl'> Agenda</h1>
        <EventCalendar
          events={appointements}
          onEventClick={console.log}
          onEventsChange={handleEventChange}
          onDateChange={console.log}
          onViewChange={handleViewChange}
          apiRef={apiRef}
          defaultView="day"
          
          className="h-full w-full"
          >
          <div className='flex justify-between'>

          <EventCalendarNav className="min-w-0 "></EventCalendarNav>
          <EventCalendarToolbar>
            <Button size="sm" onClick={()=> setOpenCreateDialog(true)}>
              <PlusIcon  className="size-4" aria-hidden="true" />
              New event
            </Button>
          </EventCalendarToolbar>
          </div>
          <EventCalendarContent/>
        </EventCalendar>
      </div>
    </>
  )
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

