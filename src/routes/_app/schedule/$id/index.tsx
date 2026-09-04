import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '#/components/ui/alert-dialog'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { Textarea } from '#/components/ui/textarea'
import type { AppointmentWithPerson } from '#/entities/appointment.entity'
import { getAllAppointmentsForPatient, getAppointmentDetails, updateAppointment, updateAppointmentStatus } from '#/server/functions/appointments'
import { createFileRoute, notFound, useBlocker, useNavigate, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { differenceInMonths, format, isAfter } from 'date-fns'
import { ArrowLeft, CalendarX2, ClipboardClock, Edit, ExternalLink, Save, SquareCheckBig } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { pt } from "date-fns/locale"
import UpdateDialog from '#/components/schedule/update-dialog'

export const Route = createFileRoute('/_app/schedule/$id/')({
  component: RouteComponent,
  loader: async ({params}) => {
    const currentAppointment = await getAppointmentDetails({data:{id:params.id}})
    if(!currentAppointment) throw notFound() 
    const allPatientAppointements = await getAllAppointmentsForPatient({data: {id: currentAppointment.therapistPerson.person.id}})
    const allPatientAppointementsExceptCurrent = allPatientAppointements.filter(a => a.id !== currentAppointment.id)
    return { appointment: currentAppointment , appointments: allPatientAppointementsExceptCurrent}
  },
  notFoundComponent:() => <div className='m-10'>
    <h1 className='font-heading text-2xl'>A consulta que estás a tentar aceder não está acessível...</h1>
    <span>Se achas que isto é um erro, por favor contacta o suporte.</span> 
  </div>

})

function RouteComponent() {
  const { appointment, appointments} = Route.useLoaderData()
  const patient = appointment.therapistPerson.person
  
  const navigate = useNavigate()
  const router = useRouter()
  const [notes, setNotes] = useState(appointment.notes ?? "")
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)

  const enableNotes = (appointment.notes ?? "") === notes 
  
  useEffect(() => {
    setNotes(appointment.notes ?? "")
  }, [appointment.notes])

  const updateAppointmentStatusFn = useServerFn(updateAppointmentStatus)
  const updateAppointmentFn = useServerFn(updateAppointment)

  const {proceed, reset, status } = useBlocker({
    shouldBlockFn: () => !enableNotes,
    enableBeforeUnload: !enableNotes,
    withResolver: true
  })

  async function updateNotes() {
    await updateAppointmentFn({data:{id:appointment.id, notes}})
    toast.success("Notas da sessão atualizado com sucesso")
    router.invalidate()
  }

  async function updateStatus(status: "finished"|"canceled"|"not_started") {
    await updateAppointmentStatusFn({data:{id: appointment.id, status}})
    toast.success("Estado da sessão atualizado com sucesso")
    router.invalidate()
  }

  return <main className='p-10 flex flex-col h-dvh overflow-hidden w-full' id="detailed-appointment-page relative">
    <UpdateDialog appointment={appointment} open={openUpdateDialog} setOpen={setOpenUpdateDialog} patientOptions={[patient]} refreshData={()=> router.invalidate()}/>
    <AlertDialog open={status === 'blocked'}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Alterações nas notas não foram guardadas</AlertDialogTitle>
          <AlertDialogDescription>Fizeste alterações nas notas e não as guardaste. Queres continuar?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={reset}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={proceed}>Sair mesmo assim</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <small className="cursor-pointer flex border max-w-max py-1 rounded-sm  px-2 items-center gap-1" onClick={()=>router.history.back()}><ArrowLeft size={20}/> Voltar</small>
    <h1 className='text-2xl mt-5'>Paciente: <b>{patient.name}</b></h1>
    <div className='grid lg:grid-cols-2 gap-10 mt-5 flex-1 min-h-0'> 
      <section id="selected-appointment">
        <Card>
          <CardHeader>
            <CardTitle>{patient.name}</CardTitle>
            <CardDescription className='flex justify-between'>
              <div>
                <p>Início: <b>{format(appointment.date, "HH:mm 'de' EEEE, d 'de' MMMM 'de'  yyyy", {locale: pt}) }</b></p>
                <p>Duração: <b>{appointment.duration} minutos</b></p>
                <p>Localização: <b>{appointment.therapistPerson.clinic}</b></p>
                <p>Processo: <b>{appointment.therapistPerson.process}</b></p>
                <p>Entidade: <b>{appointment.therapistPerson.entity}</b></p>
                <p>Idade: <b>{displayAge(differenceInMonths(new Date(), new Date(appointment.therapistPerson.person.birthDate)))}</b></p>
                <p>Diagonóstico Clínico Terapêutico: <b>{appointment.therapistPerson.therapeuticalDiagnosis || "Não definido"}</b></p>
                <p>Diagonóstico Clínico: <b>{appointment.therapistPerson.clinicalDiagnosis || "Não definido"}</b></p>
              </div>
              <div>
                <Badge className="w-fit text-lg" variant={appointment.status === 'not_started' ? 'secondary' : appointment.status === 'canceled' ? "destructive" : 'default'}>
                  {statusLabels[appointment.status].icon}
                  {statusLabels[appointment.status].name}
                </Badge>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className='flex gap-2 items-center'>
            <Textarea
              value={notes} 
              placeholder='Não foram encontradas notas para esta consulta, começa a escrever para adicionar'
              onChange={e => setNotes(e.target.value)}
            />
            <Button disabled={enableNotes} onClick={updateNotes}><Save/></Button>
          </CardContent>
          <CardFooter className='flex flex-row justify-between'>
            <Button variant={"outline"} onClick={()=>setOpenUpdateDialog(true)}><Edit/> Alterar</Button>
              <div className='flex gap-2'>
                {appointment.status === "not_started" && (<>
                  <Button onClick={()=>updateStatus("canceled")} variant="destructive">Cancelar sessão</Button>
                  <Button onClick={()=>updateStatus("finished")} disabled={isAfter(appointment.date, new Date())}>Concluir sessão</Button>
                  </>)}
                {appointment.status === "finished" && (<>
                  <Button onClick={()=>updateStatus("canceled")} variant="destructive">Cancelar sessão</Button>
                  <Button onClick={()=>updateStatus("not_started")} variant="secondary">Cancelar término</Button>
                  </>)}
                {appointment.status === "canceled" && (<>
                  <Button onClick={()=>updateStatus("not_started")} variant="secondary">Cancelar término</Button>
                  <Button onClick={()=>updateStatus("finished")} disabled={isAfter(appointment.date, new Date())}>Concluir sessão</Button>
                  </>)}
              </div>
          </CardFooter>
        </Card>
      </section>
      <section id="other-appointments" className='h-full  min-h-0 overflow-auto flex flex-col gap-2'>
        <h3 className='font-heading text-xl'>Outras consultas</h3>
        {appointments.map(a => (
          <Card key={a.id} className='gap-1'>
            <CardHeader>
              <CardTitle className='flex justify-between items-center'>
                <div className='flex flex-col gap-2'>
                  <p>{format(a.date, "HH:mm 'de' EEEE, d 'de' MMMM 'de'  yyyy", {locale: pt}) }</p> 
                  <Badge className="w-fit" variant={a.status === 'not_started' ? 'secondary' : a.status === 'canceled' ? "destructive" : 'default'}>
                    {statusLabels[a.status].icon}
                    {statusLabels[a.status].name}
                  </Badge>
                </div>
                <Button onClick={()=> navigate({to: `/schedule/${a.id}`})}><ExternalLink/></Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{a.notes=== "" ? "Não foram adicionadas notas a esta sessão": a.notes}</p>
            </CardContent>
          </Card>
        ))}
        {!appointments.length && "Não existem outras consultas" }
      </section>
    </div>
  </main>
}


function displayAge(months: number) {
  if(months < 12) return months + " meses"
  const years = Math.floor(months/12)
  if(years === 1) return "1 ano"
  return years + " anos"
}

const statusLabels: Record<AppointmentWithPerson["status"], {name: string, icon:React.ReactElement}> = {
    not_started:{name: 'Por iniciar', icon:<ClipboardClock /> },
    canceled: {name: 'Cancelada', icon:<CalendarX2/> },
    finished: {name: 'Terminada', icon:<SquareCheckBig/> },
  }