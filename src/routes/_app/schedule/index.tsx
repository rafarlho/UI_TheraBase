import { EventCalendar } from '#/components/reui/event-calendar/event-calendar'
import type{ EventCalendarApi } from '#/components/reui/event-calendar/event-calendar'
import { EventCalendarContent } from '#/components/reui/event-calendar/event-calendar-content'
import { EventCalendarDatePicker, EventCalendarNav, EventCalendarToolbar } from '#/components/reui/event-calendar/event-calendar-nav'
import type { CalendarEvent, EventCalendarOccurrence } from '#/components/reui/event-calendar/event-calendar-types'
import CreateDialog from '#/components/schedule/create-dialog'
import { Button } from '#/components/ui/button'
import type { AppointmentWithPerson } from '#/entities/appointment.entity'
import { deleteAppointment, getByTherapistAndDate, updateAppointment, updateAppointmentStatus } from '#/server/functions/appointments'
import { getPatientOptions } from '#/server/functions/persons'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { UseNavigateResult } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { addMinutes, differenceInMinutes, endOfWeek, format, isEqual, startOfWeek } from 'date-fns'
import { Delete, Link, MapPin, PlusIcon, Trash } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { pt } from "date-fns/locale"
import { ptI18n } from '#/utils/calendar-portuguese'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '#/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/_app/schedule/')({
  component: RouteComponent,
  loader: async () => {
      const [appointementsLoaded, patientsLoaded] = await Promise.all([
        getByTherapistAndDate({data:{startDate: startOfWeek(new Date()), endDate: endOfWeek(new Date())}}),
        getPatientOptions()
      ])
      console.log(appointementsLoaded, patientsLoaded)
      return {appointementsLoaded, patientsLoaded}
  },
  errorComponent: ({ error }) => <>Algo correu mal: {error.message}</>
})

function RouteComponent() {
  const {appointementsLoaded, patientsLoaded} = Route.useLoaderData()

  const [appointements, setAppointments] = useState<CalendarEvent<AppointmentWithPerson>[]>([])
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [selectedDates, setSelectedDates] = useState<{startDate: Date, endDate: Date}| null>(null)

  const updateAppointementFn = useServerFn(updateAppointment)
  const updateAppointmentStatusFn = useServerFn(updateAppointmentStatus)
  const getByTherapistAndDateFn = useServerFn(getByTherapistAndDate)
  const deleteAppointmentFn = useServerFn(deleteAppointment)

  
  const apiRef = useRef<EventCalendarApi<AppointmentWithPerson> | null>(null)
  
  const navigate = useNavigate()
  

  useEffect(()=> setAppointments(appointementsLoaded.map(a => parseAppointmentToCalendarEvent(a))),[appointementsLoaded])
  useEffect(()=> {if(!openCreateDialog) setSelectedDates(null)},[openCreateDialog])

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

  async function updateStatus(id: string, status: "not_started" | "finished" | "canceled") {
    const result = await updateAppointmentStatusFn({data:{id, status}})
    if(result) {
      await getAppointmentsByRange()
      toast.success("Consulta atualizada com sucesso!")
      
    }
    else toast.error("Não foi possível atualizar a consulta")
  }

  async function handleDelete(id:string) {
    const result = await deleteAppointmentFn({data:{id}})
    if(result) {
      await getAppointmentsByRange()
      toast.success("Consulta eliminada com sucesso!")
      
    }
    else toast.error("Não foi possível eliminar a consulta")
  }

  async function getAppointmentsByRange() {
    const {start, end} = apiRef.current!.getActiveRange()
    const appointments = await getByTherapistAndDateFn({data:{
      startDate: new Date(start),
      endDate: new Date(end),
    }})
    setAppointments(appointments.map(a => parseAppointmentToCalendarEvent(a)))
  }

  return (
    <>
      <CreateDialog open={openCreateDialog} setOpen={setOpenCreateDialog} patientOptions={patientsLoaded} refreshData={getAppointmentsByRange} selectedDates={selectedDates} />
      <div className='h-dvh p-5 flex flex-col min-w-0 overflow-hidden gap-3 w-full'>
        <h1 className='font-heading font-bold text-2xl'> Agenda</h1>
        <EventCalendar
          locale={pt}
          todayClassName='font-bold text-foreground! bg-secondary/20!'
          i18n={ptI18n}
          events={appointements}
          onSelectSlot={(e)=> {
            setSelectedDates({startDate: e.start, endDate: e.end})
            setOpenCreateDialog(true)
          }}
          onEventsChange={handleEventChange}
          onDateChange={getAppointmentsByRange}
          onViewChange={getAppointmentsByRange}
          renderAgendaEvent={props => renderCalendarEvent(props.occurrence, "agenda", navigate, updateStatus, handleDelete)}
          apiRef={apiRef}
          scrollToHour={(new Date()).getHours()}
          interactions={{
            drag: false,
            resize: false,
            selectSlot: true,
          }}
          classNames={{
            event: "!p-0"
          }}
          dayStartHour={8}
          dayEndHour={20}
          defaultView="week"
          className="h-full w-full"
          renderEvent={(props) => renderCalendarEvent(props.occurrence, props.view, navigate, updateStatus, handleDelete)}
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

function renderCalendarEvent(
  occurrence: EventCalendarOccurrence<AppointmentWithPerson>, 
  view: string, 
  navigate: UseNavigateResult<string>, 
  updateStatus: (id:string, status: "not_started" | "finished" | "canceled")=>void,
  handleDelete: (id:string) => void
){

  
  const appointment = occurrence.event.data
  const patient = appointment?.therapistPerson.person.name
  const parts = patient?.split(" ")
  const firstAndLastName = parts && parts.length > 1 ? parts[0] + " " + parts[parts.length-1] : patient


  return <DropdownMenu >
      <DropdownMenuTrigger className={cn(
        'w-full h-full p-1 border rounded-md', 
        appointment!.status === "not_started" ? "bg-accent border-secondary-foreground" : 
        appointment!.status === "canceled" ? "bg-red-500/20 border-red-500" : "bg-primary/20 border-primary"
      )}>
        <div className='flex flex-row justify-between py-1 w-full overflow-hidden opacity-100'>
          <div className='flex items-center gap-5'>
            {view === "agenda" && (
              <span>{format(occurrence.start, "HH:mm")} - {format(occurrence.end, "HH:mm")}</span>
            )}
            <div className='flex flex-col'>
              <span className="font-medium truncate">{firstAndLastName}</span>
              {view !== "month" && (
                <>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground truncate">
                  <MapPin className="size-3 shrink-0" />
                    {appointment!.therapistPerson.clinic}
                  </span>
                </>
                )}
            </div>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate({to: `/schedule/${appointment?.id}/`})}><Link/>Ver</DropdownMenuItem>
          <DropdownMenuItem onClick={()=> handleDelete(appointment!.id)}><Trash/>Eliminar</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Estado</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={appointment?.status} onValueChange={e => updateStatus(appointment!.id, e as "not_started" | "finished" | "canceled")}>
            <DropdownMenuRadioItem value="not_started">Não iniciada</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="finished">Terminada</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="canceled">Cancelada</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

      
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

