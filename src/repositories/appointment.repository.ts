import { db } from "#/db";
import { appointment, therapistPerson } from "#/db/schema";
import type { NewAppointment, Appointment, AppointmentWithPerson } from "#/entities/appointment.entity";
import { and, eq, gte, lte } from "drizzle-orm";
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
        return db.query.appointment.findMany({
            where : and(
                gte(appointment.date, startOfDay(startDate)),
                lte(appointment.date, endOfDay(endDate)),
            ),
            with: {
                therapistPerson: {
                    where: eq(therapistPerson.therapistId, therapistId),
                    with: {person:true}
                }
            }
        })
    },

    async findByTherapistPersonId(therapistPersonId: string): Promise<Appointment[]> {
        return db.query.appointment.findMany({where: eq(appointment.therapistPersonId, therapistPersonId)})
    },

    async create(data: NewAppointment): Promise<Appointment> {
        const [created] = await db.insert(appointment).values(data).returning();
        return created
    },

    async update(id:string, data: Partial<NewAppointment>): Promise<Appointment> {
        const [updated] = await db.update(appointment)
            .set(data)
            .where(eq(appointment.id,id))
            .returning()
        return updated
    },

    async updateStatus(id: string, status: "finished" | "canceled") : Promise<void> {
        await db.update(appointment).set({status: status}).where(eq(appointment.id, id))
    }
}