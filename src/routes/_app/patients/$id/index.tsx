import type { PatientFormValues } from '#/components/forms/patient-form'
import PatientForm from '#/components/forms/patient-form'
import { MarkdownEditor } from '#/components/markdown-editor'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '#/components/ui/alert-dialog'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '#/components/ui/dialog'
import type { PersonWithTherapist } from '#/entities/person.entity'
import { displayAgeByMonths } from '#/helpers/date-helper'
import { getAllAppointmentsForPatient } from '#/server/functions/appointments'
import { getPersonById, updatePatient } from '#/server/functions/persons'
import { getTherapistPatientsById, removePatientFromTherapist, updateTherapistPerson } from '#/server/functions/therapist-person'
import { statusLabels } from '#/utils/appointment-status'
import { createFileRoute, notFound, useBlocker, useNavigate, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { ArrowLeft, Edit, ExternalLink, Save, Trash } from 'lucide-react'
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
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false)
  const [anamnesis, setAnamnesis] = useState(patient.therapistPerson?.anamnesis ?? ANAMNESIS_TEMPLATE)
  const [savedAnamnesis, setSavedAnamnesis] = useState(patient.therapistPerson?.anamnesis ?? ANAMNESIS_TEMPLATE)

  const isDirty = anamnesis !== savedAnamnesis

  const updateTherapistPersonFn = useServerFn(updateTherapistPerson)
  const updatePersonFn = useServerFn(updatePatient)
  const removePatientFromTherapistFn = useServerFn(removePatientFromTherapist)

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


  async function updateAnamnesis() {
    await updateTherapistPersonFn({data:{therapistPersonId:patient.therapistPerson!.id, anamnesis}})
    setSavedAnamnesis(anamnesis)
    toast.success("Anamnese atualizada com sucesso")
    router.invalidate()
  }

  async function handleRemovePatient() {
      await removePatientFromTherapistFn({data:{personId:patient.id}})
      setOpenRemoveDialog(false)
      router.history.back()
      toast.success(`O paciente foi removido com sucesso`)
  }

  const {proceed, reset, status } = useBlocker({
      shouldBlockFn: () => isDirty,
      enableBeforeUnload: isDirty,
      withResolver: true
    })

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
    <Dialog open={openRemoveDialog}>
        {removeDialog({handleRemovePatient, setOpenRemoveDialog})}
    </Dialog>
    <AlertDialog open={status === 'blocked'}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Alterações na anamnese não foram guardadas</AlertDialogTitle>
          <AlertDialogDescription>Fizeste alterações na anamnese e não as guardaste. Queres continuar?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={reset}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={proceed}>Sair mesmo assim</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <small className="cursor-pointer flex border max-w-max py-1 rounded-sm  px-2 items-center gap-1" onClick={()=>router.history.back()}><ArrowLeft size={20}/> Voltar</small>
    <div className='grid lg:grid-cols-2 gap-10 mt-5 flex-1 min-h-0'> 
      <section id="selected-appointment" className='h-full  min-h-0 overflow-auto flex flex-col gap-2'> 
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>{patient.name}</CardTitle>
            <CardDescription className='grid grid-cols-3 gap-5 text-lg'>
              <div>
                <p>Idade</p>
                <b>{displayAgeByMonths(patient.birthDate)}</b>
              </div>
              <div>
                <p>Data de nascimento</p>
                <b>{format(patient.birthDate,"yyyy-MM-dd")}</b>
              </div>
              <div>
                <p>Contacto</p>
                <b>{patient.phoneNumber}</b>
              </div>
              <div>
                <p>Clinica</p>
                <b>{patient.therapistPerson?.clinic}</b>
              </div>
              <div>
                <p>Processo</p>
                <b>{patient.therapistPerson?.process}</b>
              </div>
              <div>
                <p>Entidade</p>
                <b>{patient.therapistPerson?.entity}</b>
              </div>
              <div className='col-span-3'>
                <p>Diagonóstico Terapêutico</p>
                <b>{patient.therapistPerson?.therapeuticalDiagnosis || "Não definido"}</b>
              </div>
              <div className='col-span-3'>
                <p>Diagonóstico Clínico</p>
                <b>{patient.therapistPerson?.clinicalDiagnosis || "Não definido"}</b>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-2 items-end'>
            <MarkdownEditor value={anamnesis} onChange={setAnamnesis} onReady={md => {
              setAnamnesis(md)
              setSavedAnamnesis(md)
            }} />
            <Button disabled={!isDirty} onClick={updateAnamnesis}><Save/> Guardar anamnese</Button> 
          </CardContent>
          <CardAction className='px-5 flex justify-between w-full'>
            <Button variant={"outline"} onClick={()=>setOpenEditDialog(true)}><Edit/> Alterar</Button>
            <Button variant={'destructive'} onClick={()=> {setOpenRemoveDialog(true)}}><Trash/>Remover</Button>
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

function removeDialog({handleRemovePatient, setOpenRemoveDialog}: {handleRemovePatient: () => void, setOpenRemoveDialog: (value:boolean) => void}) {
    return(
        <DialogContent showCloseButton={false}>
            <DialogHeader>
                <DialogTitle>Remover paciente</DialogTitle>
                <DialogDescription>
                    Tens a certeza que pretendes remover o paciente?<br></br> Se confirmares, todas as consultas futuras e passadas vão desaparecer da tua agenda.
                </DialogDescription>
                </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setOpenRemoveDialog(false)}>Cancelar</Button>
                <Button variant="destructive" onClick={() => handleRemovePatient()}>Remover</Button>
            </DialogFooter>
        </DialogContent>
    )
}

const ANAMNESIS_TEMPLATE = `#### 1. INFORMAÇÕES DO UTENTE
- Nome completo:
- Data de nascimento:
- Profissão / Ocupação:
- Escolaridade:
- Contacto:
- Agregado familiar:
- Data da anamnese:

#### 2. MOTIVO DA CONSULTA


#### 3. HISTÓRIA CLÍNICA
- Intercorrências gestacionais:
- Condição de saúde ou diagnóstico relevante:
- Cirurgias / internamento:
- Medicação habitual:
- Alterações auditivas ou visuais:

#### 4. HISTÓRICO TERAPÊUTICO
- Histórico de TF:
- Outras especialidades:

#### 5. AUTONOMIA E FUNCIONALIDADE
- Interesses:
- Dependência nas AVD's:

#### OBSERVAÇÕES

` 