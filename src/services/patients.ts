import { createPerson, getPersonByName  } from "#/server/functions/persons"
import { addPatientToTherapist, enableTherapistPerson, getTherapistPatientsById } from "#/server/functions/therapist-person"
import { toast } from "sonner"

export const addPatientToTherapistByName =async (name:string) => {
    let person = await getPersonByName({data:{name}}) 
    if(!person)  {
        person = await createPerson({data:{name}})
        return await addPatientToTherapist({data:{personId: person.id}})
    }
    
    const currentMatch = await getTherapistPatientsById({data:{personId: person.id}})
    
    if(!currentMatch) {
        return  await addPatientToTherapist({data:{personId: person.id}})
    }

    if(!currentMatch.active) {
        return await enableTherapistPerson({data:{ id:currentMatch.id}})
    }

    toast.warning(`O paciente ${person.name} já está associado a ti`)
    throw new Error("Patient already associated with therapistdrone fail")

}