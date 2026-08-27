import { db } from "#/db";
import { person, therapistPerson } from "#/db/schema";
import type { NewPerson, Person } from "#/entities/person.entity";
import { and, eq, ilike } from "drizzle-orm";

export const personRepository = {
    
    async findById(id:string): Promise <Person | undefined> {
        return db.query.person.findFirst({where: and(
            eq(person.id, id), 
            eq(person.active, true)
        )})
    },

    async findByName(name:string): Promise <Person | undefined> {
        return db.query.person.findFirst({where: and(
            ilike(person.name, name), 
            eq(person.active, true)
        )})
    },

    async findPatientOptionsByTherapist(therapistId: string): Promise<{ id: string; name: string }[]> {
        return db.select({ id: therapistPerson.id, name: person.name })
            .from(therapistPerson)
            .innerJoin(person, eq(therapistPerson.personId, person.id))
            .where(
                and(
                    eq(therapistPerson.therapistId, therapistId),
                    eq(therapistPerson.active, true)
                )
            )
    },

    async getPatientsByTherapistId(therapistId:string) : Promise<Person[]> {
        return db.select({person})
            .from(person)
            .innerJoin(therapistPerson, eq(person.id, therapistPerson.personId))
            .where(
                and(
                    eq(therapistPerson.therapistId, therapistId),
                    eq(therapistPerson.active, true)
                    
                ) 
            )
            .then(rows => rows.map(r=>r.person))
    },

    async getPatientsByTherapistIdAndName(therapistId:string, name?: string) : Promise<Person[]> {
        return db.select({person})
            .from(person)
            .innerJoin(therapistPerson, eq(person.id, therapistPerson.personId))
            .where(
                and(
                    eq(therapistPerson.therapistId, therapistId),
                    eq(therapistPerson.active, true),
                    ilike(person.name, `%${name}%`)
                    
                ) 
            )
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