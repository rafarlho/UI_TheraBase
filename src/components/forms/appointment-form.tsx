import { statusEnum } from "#/db/schema"
import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Save } from "lucide-react"
import { Textarea } from "../ui/textarea"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

z.config(z.locales.pt())
const appointmentFormSchema = z.object({
    date: z.date({error: "Campo de preenchimento obrigatório"}),
    duration: z.number().min(1,"Campo de preenchimento obrigatório"),
    location: z.string().min(1,"Campo de preenchimento obrigatório"),
    therapistPersonId: z.string().min(1, "Seleciona um paciente"),
    notes: z.string().optional()
})

export type AppointementFormValues = z.infer<typeof appointmentFormSchema>

type AppointementFormProps = {
    defaultValues?: AppointementFormValues,
    onSubmit: (values:AppointementFormValues) => void ,
    patientOptions: { id: string; name: string }[],
}

function AppointmentForm({defaultValues, onSubmit, patientOptions}: AppointementFormProps) {
    
    if(!defaultValues)
        defaultValues = {
            date: new Date(),
            duration: 45,
            location: "",
            notes: "",
            therapistPersonId:""
        }

        
    
    const form = useForm<AppointementFormValues>({
        resolver: zodResolver(appointmentFormSchema),
        defaultValues
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="therapistPersonId"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Paciente</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Seleciona um paciente" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {patientOptions.map((option) => (
                                        <SelectItem key={option.id} value={option.id}>
                                            {option.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage/>
                        </FormItem>
                )}/>
                <FormField 
                    control={form.control}
                    name="location"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Localização</FormLabel>
                            <FormControl>
                                <Input {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="duration"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Duração</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value === "" ? 1 : Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="date"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Data</FormLabel>
                            <FormControl>
                                <Input type="datetime-local" 
                                    value={format(field.value, "yyyy-MM-dd'T'HH:mm")}
                                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="notes"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Notas</FormLabel>
                            <FormControl>
                                <Textarea {...field} rows={6}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit"><Save/> Guardar</Button>
            </form>
        </Form>
    )
}

export default AppointmentForm
