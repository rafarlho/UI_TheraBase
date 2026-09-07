import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender } from "@tanstack/react-table"
import type { Person, PersonWithTherapist } from '#/entities/person.entity'
import { getTherapistPatients, getTherapistPatientsByName, updatePatient } from '#/server/functions/persons'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table'
import { ExternalLink, Plus, Trash } from 'lucide-react'
import EditableCell from '#/components/editable-cell'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useMemo, useState } from 'react'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '#/components/ui/dialog'
import { addPatientToTherapistByNameAndBirthDate } from '#/services/patients'
import { removePatientFromTherapist, updateTherapistPerson } from '#/server/functions/therapist-person'
import { toast } from 'sonner'
import { getAllAppointmentsForPatient } from '#/server/functions/appointments'
import { format, isAfter, isBefore } from 'date-fns'
import PatientForm from '#/components/forms/patient-form'
import type {  PatientFormValues } from '#/components/forms/patient-form'

export const Route = createFileRoute('/_app/patients')({
    component: RouteComponent,
    loader: async () => {
        return getTherapistPatients()
    }
})

const columnHelper = createColumnHelper<PersonWithTherapist>()

function RouteComponent() {
    const loaderData = Route.useLoaderData()
    const router = useRouter()
    const navigate = useNavigate()
    
    const [search, setSearch] = useState("")
    const [patients, setPatients] = useState<PersonWithTherapist[]>([])
    const [openCreateDialog, setOpenCreateDialog] = useState(false)
    const [openRemoveDialog, setOpenRemoveDialog] = useState(false)
    const [selectedPatientToRemove, setSelectedPatientToRemove] = useState<string|null>(null)

    const updatePatientFn = useServerFn(updatePatient)
    const updateTherapistPersonFn = useServerFn(updateTherapistPerson)
    const getCurrentTherapistPatientsFn = useServerFn(getTherapistPatientsByName)

    useEffect(()=> setPatients(loaderData),[loaderData])

    useEffect(()=> {
        const timeout = setTimeout(async ()=> {
            const filteredPatients =  await getCurrentTherapistPatientsFn({
                data:{
                    name: search
                }}) 
            setPatients(filteredPatients)
        },500)

        return () => clearTimeout(timeout)
    },[search])

    const getAllAppointmentsForPatientFn = useServerFn(getAllAppointmentsForPatient)

    async function navigateToPatient(id: string) {
        const allAppointment = await getAllAppointmentsForPatientFn({data:{id}})
        const finishedAppointments = allAppointment.filter(a => a.status === "finished" && isBefore(a.date, new Date()))
        const toAttendAppointments = allAppointment.filter(a => a.status === "not_started" && isAfter(a.date, new Date()))
        if(finishedAppointments.length) navigate({to: `/schedule/${finishedAppointments[finishedAppointments.length-1].id}` })
        else if(toAttendAppointments.length) navigate({to: `/schedule/${toAttendAppointments[toAttendAppointments.length-1].id}` })
        else toast.info("Não existem consultas para o paciente selecionado")
    }

    const columns = useMemo(()=>[
        columnHelper.accessor("name",{
            header: "Nome",
            cell: cell => <EditableCell 
            value={cell.getValue()}
            onSave={newValue => updatePatientFn({data: {id: cell.row.original.id, name: newValue}})}
            />
        },),
        columnHelper.accessor("birthDate",{
            header: "Data de Nascimento",
            cell: cell => <EditableCell 
            value={format(cell.getValue(), "dd-MM-yyyy")}
            onSave={newValue => updatePatientFn({data: {id: cell.row.original.id, birthDate: format(new Date(newValue), "yyyy-MM-dd")}})}
            />
        },),
        columnHelper.accessor("therapistPerson.clinic",{
            header: "Clinica",
            cell: cell => <EditableCell 
            value={cell.getValue()}
            onSave={newValue => updateTherapistPersonFn({data: {therapistPersonId: cell.row.original.therapistPerson!.id, clinic: newValue}})}
            />
        },),
        columnHelper.accessor("therapistPerson.process",{
            header: "Processo",
            cell: cell => <EditableCell 
            value={cell.getValue()+""}
            onSave={newValue => updateTherapistPersonFn({data: {therapistPersonId: cell.row.original.therapistPerson!.id, process: +newValue}})}
            />
        },),
        columnHelper.accessor("therapistPerson.entity",{
            header: "Entidade",
            cell: cell => <EditableCell 
            value={cell.getValue()}
            onSave={newValue => updateTherapistPersonFn({data: {therapistPersonId: cell.row.original.therapistPerson!.id, entity: newValue}})}
            />
        },),
        columnHelper.accessor("therapistPerson.therapeuticalDiagnosis",{
            header: "Diag. Terapêutico",
            cell: cell => <EditableCell 
            value={cell.getValue() ?? ""}
            onSave={newValue => updateTherapistPersonFn({data: {therapistPersonId: cell.row.original.therapistPerson!.id, therapeuticalDiagnosis: newValue}})}
            />
        },),
        columnHelper.accessor("therapistPerson.clinicalDiagnosis",{
            header: "Diag. Clínico",
            cell: cell => <EditableCell 
            value={cell.getValue() ?? ""}
            onSave={newValue => updateTherapistPersonFn({data: {therapistPersonId: cell.row.original.therapistPerson!.id, clinicalDiagnosis: newValue}})}
            />
        },),
        columnHelper.accessor("id",{header: "", cell: (cell) => <div className='flex w-full justify-end gap-3'>
                    <Button variant={'destructive'} onClick={()=> {setSelectedPatientToRemove(cell.getValue()); setOpenRemoveDialog(true)}}><Trash/></Button>
                    <Button onClick={()=> navigateToPatient(cell.getValue())}><ExternalLink/></Button>
                </div>
                }),

    ],[updatePatientFn, updateTherapistPersonFn])

    const table = useReactTable({
        data:patients,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
    })

    async function handleCreatePatient(values: PatientFormValues) {
        await addPatientToTherapistByNameAndBirthDate(values)
        setOpenCreateDialog(false)
        router.invalidate()
        toast.success(`O paciente ${name} foi adicionado com sucesso`)
    }

    async function handleRemovePatient() {
        await removePatientFromTherapist({data:{personId:selectedPatientToRemove!}})
        setOpenRemoveDialog(false)
        router.invalidate()
        toast.success(`O paciente foi removido com sucesso`)
    }


    function renderTable() {
        return (
            <div className="min-h-0 flex-1 p-2">
                <div className='shadow-xl'>
                    <Table className='bg-foreground/5' >
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) =>(
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className='font-bold'>
                                            {header.isPlaceholder ? 
                                                null : 
                                                flexRender(header.column.columnDef.header, header.getContext())
                                            }
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map(row =>(
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }

    return (
        <div className='h-dvh p-5 flex flex-col min-w-0 overflow-hidden gap-3 w-full'>
            <h1 className='font-heading font-bold text-2xl'> Pacientes</h1>
            <div className='flex gap-2 justify-end'>
                <div>
                    <Input 
                        placeholder='Procurar paciente...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Dialog open={openCreateDialog}>
                    <Button onClick={() => setOpenCreateDialog(true)}><Plus/> Adicionar</Button>
                    {createDialog({handleSubmit: handleCreatePatient, setOpenCreateDialog})}
                </Dialog>
                <Dialog open={openRemoveDialog}>
                    {removeDialog({handleRemovePatient, setOpenRemoveDialog})}
                </Dialog>
            </div>
            {patients.length ? renderTable() :<span>Não foram encontrados pacientes associados a ti{search ? " com esse nome. Valida a tua procura e tenta de novo.": "."}</span> }
            
        </div>
    )
}

function createDialog({handleSubmit,setOpenCreateDialog}:{handleSubmit: (value:PatientFormValues) => void, setOpenCreateDialog: (value:boolean) => void}) {
    
    return(
        <DialogContent showCloseButton={false}>
            <DialogHeader>
                <DialogTitle>Adicionar um novo paciente</DialogTitle>
                <DialogDescription>
                    <PatientForm
                        onSubmit={handleSubmit}
                        closeDialog={()=> setOpenCreateDialog(false)}
                    />
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    )
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