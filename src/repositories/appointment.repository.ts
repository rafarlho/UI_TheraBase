import { db } from "#/db";
import { appointment, person, therapistPerson } from "#/db/schema";
import type { NewAppointment, Appointment, AppointmentWithPerson } from "#/entities/appointment.entity";
import { and, eq, exists, gte, lte, ne } from "drizzle-orm";
import { endOfDay, endOfToday, startOfDay, startOfToday } from "date-fns";
import { decryptOptional, encryptOptional } from "#/lib/encryption";
import { auditLogRepository } from "./audit-log.repository";

export const appointmentRepository = {

    async findTodayByTherapist(therapistId: string): Promise<Appointment[]> {
        return db.select({appointment})
            .from(appointment)
            .innerJoin(therapistPerson, eq(appointment.therapistPersonId,therapistPerson.id))
            .where(
                and(
                    eq(therapistPerson.therapistId, therapistId),
                    gte(appointment.date, startOfToday()),
                    lte(appointment.date, endOfToday()),
                ),
            )
            .then((rows) => rows.map(r => ({...r.appointment, notes: decryptOptional(r.appointment.notes)})))

    },

    async findByTherapistAndDate(therapistId: string, startDate: Date, endDate: Date): Promise<AppointmentWithPerson[]> {
        const rows = await db.select({appointment, therapistPerson, person}).from(appointment)
            .innerJoin(therapistPerson, eq(appointment.therapistPersonId, therapistPerson.id))
            .innerJoin(person, eq(therapistPerson.personId, person.id))
            .where(and(
                and(
                    eq(therapistPerson.therapistId, therapistId),
                    gte(appointment.date, startOfDay(startDate)),
                    lte(appointment.date, endOfDay(endDate)),
                ),
            ))
        return rows.map(({ appointment, therapistPerson, person }) => ({
            ...appointment,
            notes: decryptOptional(appointment.notes),
            therapistPerson: {
            ...therapistPerson,
            clinicalDiagnosis: decryptOptional(therapistPerson.clinicalDiagnosis),
            therapeuticalDiagnosis: decryptOptional(therapistPerson.therapeuticalDiagnosis),
            person,
            },
        }))
    },


    async getAppointementDetailed(therapistId: string, id: string): Promise<AppointmentWithPerson | undefined> {
        const rows = await db.select({appointment, therapistPerson, person}).from(appointment)
            .innerJoin(therapistPerson, eq(appointment.therapistPersonId, therapistPerson.id))
            .innerJoin(person, eq(therapistPerson.personId, person.id))
            .limit(1)
            .where(
                and(
                    eq(appointment.id, id),
                    eq(therapistPerson.therapistId, therapistId),
                ),
            )
        const mappedRows = rows.map(({ appointment, therapistPerson, person }) => ({
            ...appointment,
            notes: decryptOptional(appointment.notes),
            therapistPerson: {
            ...therapistPerson,
            clinicalDiagnosis: decryptOptional(therapistPerson.clinicalDiagnosis),
            therapeuticalDiagnosis: decryptOptional(therapistPerson.therapeuticalDiagnosis),
            person ,
            },
        }))
        return mappedRows[0]
    },

    async getAllAppointmentsForPatient(therapistId: string, id: string): Promise<Appointment[]> {
        return db.select({appointment}).from(appointment)
            .innerJoin(therapistPerson, eq(appointment.therapistPersonId, therapistPerson.id))
            .where(
                and(
                    eq(therapistPerson.personId, id),
                    ne(appointment.status,"canceled"),
                    eq(therapistPerson.therapistId, therapistId),
                    
                ),
            )
            .orderBy(appointment.date)
            .then((rows) => rows.map(r => ({...r.appointment, notes: decryptOptional(r.appointment.notes)})))
    },

    async findByTherapistPersonId(therapistPersonId: string): Promise<Appointment[]> {
        return db.query.appointment.findMany({where: eq(appointment.therapistPersonId, therapistPersonId)}).then((rows) => rows.map(a => ({...a, notes: decryptOptional(a.notes)})))
    },

    async create(data: NewAppointment, therapistId: string): Promise<Appointment> {
        const encryptedData = {...data,
            notes: encryptOptional(data.notes),
        }
        const [created] = await db.insert(appointment).values(encryptedData).returning();
        
        await auditLogRepository.log({therapistId, action: "create",entityId: created.id, entityType: "appointment"})
        return {...created, notes: decryptOptional(created.notes)}
    },

    async update(id: string, therapistId: string, data: Partial<NewAppointment>): Promise<Appointment | undefined> {
        const encryptedData = {...data,
            notes: encryptOptional(data.notes),
        }
        const [updated] = await db.update(appointment).set(encryptedData)
            .where(
                and(
                    eq(appointment.id, id),
                    exists(db.select().from(therapistPerson)
                        .where(
                            and(
                                eq(therapistPerson.id, appointment.therapistPersonId,),
                                eq(therapistPerson.therapistId, therapistId),
                            ),
                        ),
                    ),
                ),
            )
            .returning()

        await auditLogRepository.log({therapistId, action: "update",entityId: updated.id, entityType: "appointment"})

        return {...updated, notes: decryptOptional(updated.notes)}
    },

    async updateStatus(id: string, therapistId:string, status: "finished" | "canceled"|"not_started") : Promise<boolean> {
        const result = await db.update(appointment).set({status: status}).where(
            and(
                eq(appointment.id, id),
                exists(db.select().from(therapistPerson).where(and(
                    eq(therapistPerson.id, appointment.therapistPersonId),
                    eq(therapistPerson.therapistId, therapistId)
                )))
            )
        ).returning({id: appointment.id})
        await auditLogRepository.log({therapistId, action: "update",entityId: id, entityType: "appointment"})
        return result.length>0
    },
}