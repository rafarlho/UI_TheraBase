import { db } from "#/db";
import { person, therapist, therapistPerson } from "#/db/schema";
import type { NewPerson, Person, PersonWithTherapist } from "#/entities/person.entity";
import { decryptOptional } from "#/lib/encryption";
import { and, eq, ilike } from "drizzle-orm";
import { auditLogRepository } from "./audit-log.repository";

export const personRepository = {
    
    async findById(id:string): Promise <Person | undefined> {
        return db.query.person.findFirst({where: and(
            eq(person.id, id), 
            eq(person.active, true)
        )})
    },

    async findByNameAndBirthDate(name:string, birthDate:string): Promise <Person | undefined> {
        return db.query.person.findFirst({where: and(
            ilike(person.name, name), 
            eq(person.birthDate, birthDate),
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

    async getPatientsByTherapistId(therapistId:string) : Promise<PersonWithTherapist[]> {
        return db.select({person, therapistPerson, therapist})
            .from(person)
            .innerJoin(therapistPerson, eq(person.id, therapistPerson.personId))
            .innerJoin(therapist, eq(therapistPerson.therapistId, therapist.id))
            .where(
                and(
                    eq(therapistPerson.therapistId, therapistId),
                    eq(therapistPerson.active, true)
                    
                ) 
            )
            .then(rows => rows.map(({person, therapistPerson, therapist})=>({
                ...person, therapistPerson: {...therapistPerson, clinicalDiagnosis: decryptOptional(therapistPerson.clinicalDiagnosis),therapeuticalDiagnosis: decryptOptional(therapistPerson.therapeuticalDiagnosis),therapist}
            })))
        
    },

    async getPatientsByTherapistIdAndName(therapistId:string, name?: string) : Promise<PersonWithTherapist[]> {
        return db.select({person, therapistPerson, therapist})
            .from(person)
            .innerJoin(therapistPerson, eq(person.id, therapistPerson.personId))
            .innerJoin(therapist, eq(therapistPerson.therapistId, therapist.id))
            .where(
                and(
                    eq(therapistPerson.therapistId, therapistId),
                    eq(therapistPerson.active, true),
                    ilike(person.name, `%${name}%`)
                    
                ) 
            )
            .then(rows => rows.map(({person, therapistPerson, therapist})=>({
                ...person, therapistPerson: {...therapistPerson, clinicalDiagnosis: decryptOptional(therapistPerson.clinicalDiagnosis),therapeuticalDiagnosis: decryptOptional(therapistPerson.therapeuticalDiagnosis),therapist}
            })))
        
    },

    async create(therapistId: string, data: NewPerson): Promise<Person> {
        const [created] = await db.insert(person).values(data).returning();
        await auditLogRepository.log({therapistId, action: "create",entityId: created.id, entityType: "person"})
        return created
    },

    async update(therapistId: string, id:string, data: Partial<NewPerson>): Promise<Person> {
        const [updated] = await db.update(person)
            .set(data)
            .where(eq(person.id,id))
            .returning()
        await auditLogRepository.log({therapistId, action: "update",entityId: id, entityType: "person"})
        return updated
    },
}