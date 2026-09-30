import type { PatientFormValues } from '#/components/forms/patient-form'
import PatientForm from '#/components/forms/patient-form'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '#/components/ui/dialog'
import type { PersonWithTherapist } from '#/entities/person.entity'
import { displayAgeByMonths } from '#/helpers/date-helper'
import { getAllAppointmentsForPatient } from '#/server/functions/appointments'
import { getPersonById, updatePatient } from '#/server/functions/persons'
import { getTherapistPatientsById, updateTherapistPerson } from '#/server/functions/therapist-person'
import { statusLabels } from '#/utils/appointment-status'
import { createFileRoute, notFound, useNavigate, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { ArrowLeft, Edit, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_app/patients/$id/')({
  component: RouteComponent,
  loader: async ({params})=> {
    const therapistPerson = await getTherapistPatientsById({data:{personId:params.id}})
    if(!therapistPerson) throw notFound()
    const person = await getPersonById({data: {id: params.id}})
    if(!person) throw notFound()
    const patient: PersonWithTherapist = {...person, therapistPerson: {...therapistPerson, therapist: null}} 
    const appointments = await getAllAppointmentsForPatient({data:{id:params.id}})
    return {patient: patient, appointments: appointments}
  },
  notFoundComponent:() => <div className='m-10'>
    <h1 className='font-heading text-2xl'>O paciente que estás a tentar aceder não está acessível...</h1>
    <span>Se achas que isto é um erro, por favor contacta o suporte.</span> 
  </div>
})

function RouteComponent() {
  const navigate = useNavigate()
  const { patient, appointments} = Route.useLoaderData()
  const router = useRouter()
  const [openEditDialog, setOpenEditDialog] = useState(false)

  const updateTherapistPersonFn = useServerFn(updateTherapistPerson)
  const updatePersonFn = useServerFn(updatePatient)

  async function handleUpdate(values: PatientFormValues) {
    await updatePersonFn({data: {
      id: patient.id,
      birthDate: values.birthDate,
      name: values.name,
      phoneNumber: values.phoneNumber
    }})
    await updateTherapistPersonFn({data: {
      therapistPersonId: patient.therapistPerson!.id,
      clinic: values.clinic,
      clinicalDiagnosis: values.clinicalDiagnosis,
      entity: values.entity,
      process: values.process,
      therapeuticalDiagnosis: values.therapeuticalDiagnosis
    }})
    toast.success("Paciente atualizado com sucesso!")
    router.invalidate()
    setOpenEditDialog(false)
  }

  return <main className='p-10 flex flex-col h-dvh overflow-hidden w-full' id="detailed-appointment-page relative">
    {openEditDialog &&  updateDialog(
      {
        birthDate: new Date(patient.birthDate),
        clinic: patient.therapistPerson?.clinic ?? "",
        entity : patient.therapistPerson?.entity?? "",
        name: patient.name,
        phoneNumber: patient.phoneNumber ?? "",
        process: patient.therapistPerson?.process ?? 0,
        clinicalDiagnosis: patient.therapistPerson?.clinicalDiagnosis ?? "",
        therapeuticalDiagnosis: patient.therapistPerson?.therapeuticalDiagnosis ?? "",
      },
      handleUpdate,
      openEditDialog,
      setOpenEditDialog
    )}
    <small className="cursor-pointer flex border max-w-max py-1 rounded-sm  px-2 items-center gap-1" onClick={()=>router.history.back()}><ArrowLeft size={20}/> Voltar</small>
    <h1 className='text-2xl mt-5'>Paciente: <b>{patient.name}</b></h1>
    <div className='grid lg:grid-cols-2 gap-10 mt-5 flex-1 min-h-0'> 
      <section id="selected-appointment">
        <Card>
          <CardHeader>
            <CardTitle>{patient.name}</CardTitle>
            <CardDescription className='flex justify-between'>
              <div>
                <p>Idade: <b>{displayAgeByMonths(patient.birthDate)}</b></p>
                <p>Data de nascimento: <b>{format(patient.birthDate,"yyyy-MM-dd")}</b></p>
                <p>Contacto: <b>{patient.phoneNumber}</b></p>
                <p>Clinica: <b>{patient.therapistPerson?.clinic}</b></p>
                <p>Processo: <b>{patient.therapistPerson?.process}</b></p>
                <p>Entidade: <b>{patient.therapistPerson?.entity}</b></p>
                <p>Diagonóstico Clínico Terapêutico: <b>{patient.therapistPerson?.therapeuticalDiagnosis || "Não definido"}</b></p>
                <p>Diagonóstico Clínico: <b>{patient.therapistPerson?.clinicalDiagnosis || "Não definido"}</b></p>
              </div>
            </CardDescription>
          </CardHeader>
          <CardAction className='px-5'>
            <Button variant={"outline"} onClick={()=>setOpenEditDialog(true)}><Edit/> Alterar</Button>
          </CardAction>
          
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

function updateDialog(defaultValues:PatientFormValues, handleSubmit: (value:PatientFormValues) => void, openEditDialog: boolean, setOpenEditDialog: (value:boolean) => void) {
    
    return(<Dialog open={openEditDialog}>
        <DialogContent showCloseButton={false}>
            <DialogHeader>
                <DialogTitle>Editar paciente</DialogTitle>
                <DialogDescription>
                    <PatientForm
                        defaultValues={defaultValues}
                        onSubmit={handleSubmit}
                        closeDialog={()=> setOpenEditDialog(false)}
                    />
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>)
}