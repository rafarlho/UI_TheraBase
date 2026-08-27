import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"

type CreateDialogProps = {
    open: boolean
    setOpen: (value: boolean) => void
}

function CreateDialog({open, setOpen}: CreateDialogProps) {
    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle>Remover paciente</DialogTitle>
                    <DialogDescription>
                        Tens a certeza que pretendes remover o paciente?<br></br> Se confirmares, todas as consultas futuras e passadas vão desaparecer da tua agenda.
                    </DialogDescription>
                    </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                    {/* <Button variant="destructive" onClick={() => handleRemovePatient()}>Remover</Button> */}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateDialog
