import { useServerFn } from "@tanstack/react-start"
import AppointmentForm from "../forms/appointment-form"
import type { AppointementFormValues } from "../forms/appointment-form"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { createAppointment } from "#/server/functions/appointments"
import { toast } from "sonner"

type CreateDialogProps = {
    open: boolean
    setOpen: (value: boolean) => void,
    patientOptions: {id:string, name:string}[]
    refreshData: () => void
}

function CreateDialog({open, setOpen, patientOptions, refreshData}: CreateDialogProps) {
    const createAppointmentFn = useServerFn(createAppointment)

    async function createAppointments(values: AppointementFormValues) {
        await createAppointmentFn({data: values})
        toast.success(`Sessão agendada com sucesso!`)
        setOpen(false)
        refreshData()
    }


    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Marcar consulta</DialogTitle>
                </DialogHeader>
                <AppointmentForm
                    patientOptions={patientOptions}
                    onSubmit={createAppointments}
                />
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateDialog
