import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender } from "@tanstack/react-table"
import type { PersonWithTherapist } from '#/entities/person.entity'
import { getTherapistPatients, getTherapistPatientsByName } from '#/server/functions/persons'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table'
import { Plus } from 'lucide-react'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '#/components/ui/dialog'
import { addPatientToTherapistByNameAndBirthDate } from '#/services/patients'
import { toast } from 'sonner'
import PatientForm from '#/components/forms/patient-form'
import type {  PatientFormValues } from '#/components/forms/patient-form'

export const Route = createFileRoute('/_app/patients/')({
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


    const columns = [
        columnHelper.accessor("name",{
            header: "Nome",           
        },),
        columnHelper.accessor("birthDate",{
            header: "Data de Nascimento",
        },),
        columnHelper.accessor("phoneNumber",{
            header: "Contacto",
        },),
        columnHelper.accessor("therapistPerson.clinic",{
            header: "Clinica",
        },),
        columnHelper.accessor("therapistPerson.process",{
            header: "Processo",
        },),
        columnHelper.accessor("therapistPerson.entity",{
            header: "Entidade",
        },),
        columnHelper.accessor("therapistPerson.therapeuticalDiagnosis",{
            header: "Diag. Terapêutico",
        },),
        columnHelper.accessor("therapistPerson.clinicalDiagnosis",{
            header: "Diag. Clínico",
        },),
    ]

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
        toast.success(`O paciente ${values.name} foi adicionado com sucesso`)
    }


    function renderTable() {
        return (
            <div className="min-h-0 flex-1 overflow-auto p-2">
                    <div className='min-w-max shadow-xl w-full'>
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
                                <TableRow key={row.id} onClick={()=> navigate({to: `/patients/${row.id}`})} className='cursor-pointer hover:bg-accent-foreground/10'>
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
        <div className='h-screen p-5 flex flex-col min-w-0 overflow-hidden gap-3 w-full '>
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