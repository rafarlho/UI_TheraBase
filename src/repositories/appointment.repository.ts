import { db } from "#/db";
import { appointment, person, therapistPerson } from "#/db/schema";
import type { NewAppointment, Appointment, AppointmentWithPerson } from "#/entities/appointment.entity";
import { and, eq, exists, gte, lte, ne } from "drizzle-orm";
import { endOfDay, endOfToday, startOfDay, startOfToday } from "date-fns";

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
            .then((rows) => rows.map(r => r.appointment))
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
            therapistPerson: {
            ...therapistPerson,
            person,
            },
        }))
    },


    async getAppointementDetailed(therapistId: string, id: string): Promise<AppointmentWithPerson> {
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
            therapistPerson: {
            ...therapistPerson,
            person,
            },
        }))
        return mappedRows[0]
    },

    async getAllAppointmentsForPatient(therapistId: string, id: string): Promise<Appointment[]> {
        return db.select({appointment}).from(appointment)
            .innerJoin(therapistPerson, eq(appointment.therapistPersonId, therapistPerson.id))
            .where(
                and(
                    eq(therapistPerson.id, id),
                    ne(appointment.status,"canceled"),
                    eq(therapistPerson.therapistId, therapistId),
                    
                ),
            )
            .orderBy(appointment.date)
            .then((rows) => rows.map(r => r.appointment))
    },

    async findByTherapistPersonId(therapistPersonId: string): Promise<Appointment[]> {
        return db.query.appointment.findMany({where: eq(appointment.therapistPersonId, therapistPersonId)})
    },

    async create(data: NewAppointment): Promise<Appointment> {
        const [created] = await db.insert(appointment).values(data).returning();
        return created
    },

    async update(id: string, therapistId: string, data: Partial<NewAppointment>): Promise<Appointment | undefined> {
    const [updated] = await db
        .update(appointment)
        .set(data)
        .where(
        and(
            eq(appointment.id, id),
            exists(db.select().from(therapistPerson)
                .where(
                and(
                    eq(
                        therapistPerson.id,
                        appointment.therapistPersonId,
                    ),
                    eq(
                        therapistPerson.therapistId,
                        therapistId,
                    ),
                ),
                ),
            ),
        ),
        )
        .returning()

    return updated
    },

    async updateStatus(id: string, therapistId:string, status: "finished" | "canceled") : Promise<boolean> {
        const result = await db.update(appointment).set({status: status}).where(
            and(
                eq(appointment.id, id),
                exists(db.select().from(therapistPerson).where(and(
                    eq(therapistPerson.id, appointment.therapistPersonId),
                    eq(therapistPerson.therapistId, therapistId)
                )))
            )
        ).returning({id: appointment.id})
        return result.length>0
    }
}