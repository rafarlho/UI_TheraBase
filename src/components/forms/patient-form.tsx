import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Save } from "lucide-react"
import { Textarea } from "../ui/textarea"
import { format } from "date-fns"

z.config(z.locales.pt())
const patientFormSchema = z.object({
    name: z.string().min(1,"Campo de preenchimento obrigatório"),
    birthDate: z.date({error: "Campo de preenchimento obrigatório"}),
    clinic: z.string().min(1,"Campo de preenchimento obrigatório"),
    process: z.number().min(1,"Campo de preenchimento obrigatório"),
    entity: z.string().min(1,"Campo de preenchimento obrigatório"),
    therapeuticalDiagnosis: z.string().optional(),
    clinicalDiagnosis: z.string().optional()
})

export type PatientFormValues = z.infer<typeof patientFormSchema>

type PatientFormProps = {
    defaultValues?: PatientFormValues,
    onSubmit: (values:PatientFormValues) => void ,
    closeDialog:() => void
}

function PatientForm({defaultValues, onSubmit, closeDialog}: PatientFormProps) {
    if(!defaultValues)
        defaultValues = {
            birthDate: new Date(),
            clinic:"",
            entity:"",
            name:"",
            process:0,
            clinicalDiagnosis:"",
            therapeuticalDiagnosis:"",
        }

    const form = useForm<PatientFormValues>({
        resolver: zodResolver(patientFormSchema),
        defaultValues
    })


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField 
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="birthDate"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Data de Nascimento</FormLabel>
                            <FormControl>
                                <Input type="date" 
                                    value={format(field.value, "yyyy-MM-dd")}
                                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="clinic"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Clínica</FormLabel>
                            <FormControl>
                                <Input {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="process"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Nº Processo</FormLabel>
                            <FormControl>
                                <Input type="number"
                                    value={field.value}
                                    onChange={(e) => field.onChange(+e.target.value)}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="entity"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Entidade</FormLabel>
                            <FormControl>
                                <Input {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="therapeuticalDiagnosis"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Diagnóstico Terapêutico</FormLabel>
                            <FormControl>
                                <Textarea {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control}
                    name="clinicalDiagnosis"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Diagnóstico Clínico</FormLabel>
                            <FormControl>
                                <Textarea {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className=" flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={closeDialog}>Cancelar</Button>
                    <Button type="submit"><Save/> Guardar</Button>
                </div>
            </form>
        </Form>
    )
}

export default PatientForm
