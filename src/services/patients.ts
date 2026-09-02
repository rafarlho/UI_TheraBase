import { createPerson, getPersonByName  } from "#/server/functions/persons"
import { addPatientToTherapist, enableTherapistPerson, getTherapistPatientsById } from "#/server/functions/therapist-person"
import { toast } from "sonner"

export const addPatientToTherapistByName =async (name:string) => {
    let person = await getPersonByName({data:{name}}) 
    if(!person)  {
        person = await createPerson({data:{name}})
        await addPatientToTherapist({data:{personId: person.id}})
        return
    }
    
    const currentMatch = await getTherapistPatientsById({data:{personId: person.id}})
    
    if(!currentMatch) {
        await addPatientToTherapist({data:{personId: person.id}})
        return
    }

    if(!currentMatch.active) {
        await enableTherapistPerson({data:{ id:currentMatch.id}})
        return
    }

    toast.warning(`O paciente ${person.name} já está associado a ti`)
    throw new Error("Patient already associated with therapistdrone fail")

}