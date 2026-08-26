import { db } from "#/db";
import { therapistPerson } from "#/db/schema";
import type { NewTherapistPerson, TherapistPerson } from "#/entities/therapist-person.entity";
import { eq } from "drizzle-orm";

export const therapistTherapistPersonRepository = {

    async create(data: NewTherapistPerson): Promise<TherapistPerson> {
        const [created] = await db.insert(therapistPerson).values(data).returning();
        return created
    },

    async update(id:string, data: Partial<NewTherapistPerson>): Promise<TherapistPerson> {
        const [updated] = await db.update(therapistPerson)
            .set(data)
            .where(eq(therapistPerson.id,id))
            .returning()
        return updated
    },

    async deactivate(id: string) : Promise<void> {
        await db.update(therapistPerson).set({active: false}).where(eq(therapistPerson.id, id
        ))
    }
}