import { db } from "#/db";
import { therapistPerson } from "#/db/schema";
import type { NewTherapistPerson, TherapistPerson } from "#/entities/therapist-person.entity";
import { decryptOptional, encryptOptional } from "#/lib/encryption";
import { and, eq } from "drizzle-orm";

export const therapistPersonRepository = {

    async findByIdForTherapist(id:string, therapistId:string) : Promise<TherapistPerson | undefined> {
        const result = await db.query.therapistPerson.findFirst({
            where: and(
                eq(therapistPerson.id, id),
                eq(therapistPerson.therapistId, therapistId)
            )
        })

        if(!result) return result

        return {
            ...result,
            clinicalDiagnosis: decryptOptional(result.clinicalDiagnosis),
            therapeuticalDiagnosis: decryptOptional(result.therapeuticalDiagnosis),
        } 
    },

    async getPatientsByTherapistIdAndPersonId(therapistId:string, personId: string) : Promise<TherapistPerson | undefined> {
        const result = await db.query.therapistPerson.findFirst({where: and(
            eq(therapistPerson.therapistId, therapistId), 
            eq(therapistPerson.personId, personId)
        )})
        
        if(!result) return result

        return {
            ...result,
            clinicalDiagnosis: decryptOptional(result.clinicalDiagnosis),
            therapeuticalDiagnosis: decryptOptional(result.therapeuticalDiagnosis),
        } 
    },

    async create(data: NewTherapistPerson): Promise<TherapistPerson> {
        const encryptedData = {...data,
            clinicalDiagnosis: encryptOptional(data.clinicalDiagnosis),
            therapeuticalDiagnosis: encryptOptional(data.therapeuticalDiagnosis),
        }
        const [created] = await db.insert(therapistPerson).values(encryptedData).returning();
        return {
            ...created,
            clinicalDiagnosis: decryptOptional(created.clinicalDiagnosis),
            therapeuticalDiagnosis: decryptOptional(created.therapeuticalDiagnosis),
        } 
    },

    async update(id:string, therapistId:string, data: Partial<TherapistPerson>): Promise<TherapistPerson> {
        const encryptedData = {...data,
            clinicalDiagnosis: encryptOptional(data.clinicalDiagnosis),
            therapeuticalDiagnosis: encryptOptional(data.therapeuticalDiagnosis),
        }

        const [updated] = await db.update(therapistPerson)
            .set(encryptedData)
            .where(and(
                eq(therapistPerson.therapistId, therapistId),
                eq(therapistPerson.id,id))
            )
            .returning()
        

        return {
            ...updated,
            clinicalDiagnosis: decryptOptional(updated.clinicalDiagnosis),
            therapeuticalDiagnosis: decryptOptional(updated.therapeuticalDiagnosis),
        } 
    },

    async deactivate(id: string, therapistId: string) : Promise<void> {
        await db.update(therapistPerson).set({active: false}).where(
            and(
                eq(therapistPerson.therapistId, therapistId),
                eq(therapistPerson.id, id)
            )
        )
    },

    async deactivateByIds(therapistId: string, personId:string) : Promise<void> {
        await db.update(therapistPerson).set({active: false}).where(
            and(
                eq(therapistPerson.personId, personId),
                eq(therapistPerson.therapistId, therapistId)
            )
        )
    }
}