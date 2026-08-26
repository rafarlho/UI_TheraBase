import { db } from "#/db";
import { therapistPerson } from "#/db/schema";
import type { NewTherapistPerson, TherapistPerson } from "#/entities/therapist-person.entity";
import { and, eq } from "drizzle-orm";

export const therapistPersonRepository = {

    
    async getPatientsByTherapistIdAndPersonId(therapistId:string, personId: string) : Promise<TherapistPerson | undefined> {
        return db.query.therapistPerson.findFirst({where: and(
                    eq(therapistPerson.therapistId, therapistId), 
                    eq(therapistPerson.personId, personId)
                )})
    },

    async create(data: NewTherapistPerson): Promise<TherapistPerson> {
        const [created] = await db.insert(therapistPerson).values(data).returning();
        return created
    },

    async update(id:string, data: Partial<TherapistPerson>): Promise<TherapistPerson> {
        const [updated] = await db.update(therapistPerson)
            .set(data)
            .where(eq(therapistPerson.id,id))
            .returning()
        return updated
    },

    async deactivate(id: string) : Promise<void> {
        await db.update(therapistPerson).set({active: false}).where(eq(therapistPerson.id, id
        ))
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