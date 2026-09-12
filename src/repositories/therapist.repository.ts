import { db } from "#/db";
import { therapist } from "#/db/schema";
import type { NewTherapist, Therapist } from "#/entities/therapist.entity";
import { and, eq } from "drizzle-orm";

export const therapistRepository = {

    async findByUserId(userId: string) : Promise<Therapist | undefined> {
        const results = await db.select().from(therapist).where(eq(therapist.userId, userId)).limit(1)
        return results[0] ?? undefined
    },

    async findById(id:string): Promise <Therapist | undefined> {
        return db.query.therapist.findFirst({where: and(
            eq(therapist.id, id), 
            eq(therapist.active, true)
        )})
    },

    async create(data: NewTherapist): Promise<Therapist> {
        const [created] = await db.insert(therapist).values(data).returning();
        return created
    },

    async update(id:string, data: Partial<NewTherapist>): Promise<Therapist> {
        const [updated] = await db.update(therapist)
            .set(data)
            .where(eq(therapist.id,id))
            .returning()
        return updated
    },

    async deactivate(id: string) : Promise<void> {
        await db.update(therapist).set({active: false}).where(eq(therapist.id, id
        ))
    }
}