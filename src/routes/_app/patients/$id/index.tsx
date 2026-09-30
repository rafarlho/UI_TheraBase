import { Button } from '#/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import type { PersonWithTherapist } from '#/entities/person.entity'
import { displayAgeByMonths } from '#/helpers/date-helps'
import { getAllAppointmentsForPatient } from '#/server/functions/appointments'
import { getPersonById } from '#/server/functions/persons'
import { getTherapistPatientsById } from '#/server/functions/therapist-person'
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { ExternalLink } from 'lucide-react'

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
  return <main className='p-10 flex flex-col h-dvh overflow-hidden w-full' id="detailed-appointment-page relative">
    {/* <small className="cursor-pointer flex border max-w-max py-1 rounded-sm  px-2 items-center gap-1" onClick={()=>router.history.back()}><ArrowLeft size={20}/> Voltar</small> */}
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
          <CardContent className='flex gap-2 items-center'>
          </CardContent>
          
        </Card>
      </section>
      <section id="other-appointments" className='h-full  min-h-0 overflow-auto flex flex-col gap-2'>
        <h3 className='font-heading text-xl'>Outras consultas</h3>
        {appointments.map(a => (
          <Card key={a.id} className='gap-1'>
            <CardHeader>
              <CardTitle className='flex justify-between items-center'>
                  <p>{format(a.date, "HH:mm 'de' EEEE, d 'de' MMMM 'de'  yyyy", {locale: pt}) }</p> 
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
