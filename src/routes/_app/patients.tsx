import { createFileRoute } from '@tanstack/react-router'
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender } from "@tanstack/react-table"
import type { Person } from '#/entities/person.entity'
import { getTherapistPatients, getTherapistPatientsByName, updatePatient } from '#/server/functions/persons'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '#/components/ui/table'
import { Plus, Trash } from 'lucide-react'
import EditableCell from '#/components/editable-cell'
import { useServerFn } from '@tanstack/react-start'
import { useEffect, useMemo, useState } from 'react'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '#/components/ui/dialog'
import { addPatientToTherapistByName } from '#/services/patients'
import { removePatientFromTherapist } from '#/server/functions/therapist-person'
import { toast } from 'sonner'

export const Route = createFileRoute('/_app/patients')({
    component: RouteComponent,
    loader: async () => {
        const therapistId = "acf18675-88c0-4b6b-a880-b9f73400a2f0"
        return getTherapistPatients({data: {therapistId}})
    }
})

const columnHelper = createColumnHelper<Person>()

function RouteComponent() {
    const loaderData = Route.useLoaderData()
    
    const [search, setSearch] = useState("")
    const [patients, setPatients] = useState<Person[]>([])
    const [openCreateDialog, setOpenCreateDialog] = useState(false)
    const [openRemoveDialog, setOpenRemoveDialog] = useState(false)
    const [selectedPatientToRemove, setSelectedPatientToRemove] = useState<string|null>(null)

    const updatePatientFn = useServerFn(updatePatient)
    const removePatientFromTherapistFn = useServerFn(removePatientFromTherapist)
    const getCurrentTherapistPatientsFn = useServerFn(getTherapistPatientsByName)
    const therapistId = "acf18675-88c0-4b6b-a880-b9f73400a2f0"

    useEffect(()=> setPatients(loaderData),[loaderData])

    useEffect(()=> {
        const timeout = setTimeout(async ()=> {
            const filteredPatients =  await getCurrentTherapistPatientsFn({
                data:{
                    therapistId: therapistId,
                    name: search
                }}) 
            setPatients(filteredPatients)
        },500)

        return () => clearTimeout(timeout)
    },[search])

    const columns = useMemo(()=>[
        columnHelper.accessor("name",{
            header: "Nome",
            cell: cell => <EditableCell 
            value={cell.getValue()}
            onSave={newValue => updatePatientFn({data: {id: cell.row.original.id, name: newValue}})}
            />
        },),
        columnHelper.accessor("id",{header: "", cell: (cell) => <Button variant={'destructive'} onClick={()=> {setSelectedPatientToRemove(cell.getValue()); setOpenRemoveDialog(true)}}><Trash/></Button>}),

    ],[updatePatientFn])

    const table = useReactTable({
        data:patients,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.id,
    })

    async function handleCreatePatient(name: string) {
        await addPatientToTherapistByName(therapistId, name)
        setOpenCreateDialog(false)
        const filteredPatients =  await getCurrentTherapistPatientsFn({
            data:{
                therapistId: therapistId,
                name: search
            }}) 
        setPatients(filteredPatients)
        toast.success(`O paciente ${name} foi adicionado com sucesso`)
    }

    async function handleRemovePatient() {
        await removePatientFromTherapist({data:{therapistId, personId:selectedPatientToRemove!}})
        setOpenRemoveDialog(false)
        const filteredPatients =  await getCurrentTherapistPatientsFn({
            data:{
                therapistId: therapistId,
                name: search
            }}) 
        setPatients(filteredPatients)
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
            <div className='flex justify-between items-center'>
                <p>Gerir pacientes associados a ti</p>
                <div className='flex gap-2'>
                    <Input 
                        placeholder='Procurar paciente...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Dialog open={openCreateDialog}>
                        <Button onClick={() => setOpenCreateDialog(true)}><Plus/> Adicionar</Button>
                        {createDialog({handleSubmit: handleCreatePatient, setOpenCreateDialog})}
                    </Dialog>
                    <Dialog open={openRemoveDialog}>
                        {removeDialog({handleRemovePatient, setOpenRemoveDialog})}
                    </Dialog>
                </div>
            </div>
            {patients.length ? renderTable() :<span>Não foram encontrados pacientes associados a ti {search ? "com esse nome. Valida a tua procura e tenta de novo.": "."}</span> }
            
        </div>
    )
}

function createDialog({handleSubmit,setOpenCreateDialog}:{handleSubmit: (name:string) => void, setOpenCreateDialog: (value:boolean) => void}) {
    const [name, setName] = useState("")
    
    return(
        <DialogContent showCloseButton={false}>
            <DialogHeader>
                <DialogTitle>Adicionar um novo paciente</DialogTitle>
                <DialogDescription>
                    <Input 
                            placeholder='Adicionar paciente...'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                </DialogDescription>
                </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>Cancelar</Button>
                <Button disabled={name.trim().length === 0} onClick={() => handleSubmit(name)}>Adicionar</Button>
            </DialogFooter>
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