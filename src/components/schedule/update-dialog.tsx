import { useServerFn } from "@tanstack/react-start"
import AppointmentForm from "../forms/appointment-form"
import type { AppointementFormValues } from "../forms/appointment-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { toast } from "sonner"
import type { Appointment } from "#/entities/appointment.entity"
import { updateAppointment } from "#/server/functions/appointments"

type UpdateDialogProps = {
    open: boolean
    setOpen: (value: boolean) => void,
    appointment: Appointment
    patientOptions: {id:string, name:string}[]
    refreshData: () => void
}

function UpdateDialog({open, setOpen, patientOptions, refreshData, appointment}: UpdateDialogProps) {
    const updateAppointmentFn = useServerFn(updateAppointment)

    async function updateAppointmentValues(values: AppointementFormValues) {
        await updateAppointmentFn({data: {...values, id: appointment.id}})
        toast.success(`Sessão alterada com sucesso!`)
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
                    isEdit={true}
                    patientOptions={patientOptions}
                    defaultValues={{
                        date: appointment.date,
                        duration: appointment.duration,
                        location: appointment.location,
                        therapistPersonId: appointment.therapistPersonId,
                        notes: appointment.notes ?? ""
                    }}
                    onSubmit={updateAppointmentValues}
                    closeDialog={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}

export default UpdateDialog
