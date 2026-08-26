import { db } from "#/db";
import { person, therapist, therapistPerson } from "#/db/schema";
import type { NewPerson, Person } from "#/entities/person.entity";
import { and, eq } from "drizzle-orm";

export const personRepository = {
    
    async findById(id:string): Promise <Person | undefined> {
        return db.query.person.findFirst({where: and(
            eq(person.id, id), 
            eq(person.active, true)
        )})
    },

    async getPatientsByTherapistId(therapistId:string) : Promise<Person[]> {
        return db.select({person})
            .from(person)
            .innerJoin(therapistPerson, eq(person.id, therapistPerson.personId))
            .where(eq(therapistPerson.therapistId, therapistId))
            .then(rows => rows.map(r=>r.person))
    },

    async create(data: NewPerson): Promise<Person> {
        const [created] = await db.insert(person).values(data).returning();
        return created
    },

    async update(id:string, data: Partial<NewPerson>): Promise<Person> {
        const [updated] = await db.update(person)
            .set(data)
            .where(eq(person.id,id))
            .returning()
        return updated
    },

    async deactivate(id: string) : Promise<void> {
        await db.update(person).set({active: false}).where(eq(person.id, id
        ))
    }
}