import type { PatientFormValues } from "#/components/forms/patient-form"
import { createPerson,  getPersonByNameAndBirthDate  } from "#/server/functions/persons"
import { addPatientToTherapist, enableTherapistPerson, getTherapistPatientsById } from "#/server/functions/therapist-person"
import { format } from "date-fns"
import { toast } from "sonner"

export const addPatientToTherapistByNameAndBirthDate =async (values: PatientFormValues) => {
    console.log("Trying to retrive")
    let person = await getPersonByNameAndBirthDate({data:{name: values.name, birthDate: format(values.birthDate, "yyyy-MM-dd")}}) 
    console.log(person)
    if(!person)  {
        person = await createPerson({data:{name: values.name,birthDate: values.birthDate}})
        return await addPatientToTherapist({data:{
            personId: person.id, 
            clinic: values.clinic,
            entity: values.entity,
            process: values.process,
            clinicalDiagnosis: values.clinicalDiagnosis,
            therapeuticalDiagnosis: values.therapeuticalDiagnosis
        }})
    }
    
    const currentMatch = await getTherapistPatientsById({data:{personId: person.id}})
    
    if(!currentMatch) {
        return  await addPatientToTherapist({data:{
            personId: person.id, 
            clinic: values.clinic,
            entity: values.entity,
            process: values.process,
            clinicalDiagnosis: values.clinicalDiagnosis,
            therapeuticalDiagnosis: values.therapeuticalDiagnosis
        }})
    }

    if(!currentMatch.active) {
        return await enableTherapistPerson({data:{ id:currentMatch.id}})
    }

    toast.warning(`O paciente ${person.name} já está associado a ti`)
    throw new Error("Patient already associated with therapistdrone fail")

}