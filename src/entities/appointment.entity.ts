import type { appointment } from "#/db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { Person } from "./person.entity";
import type { TherapistPerson } from "./therapist-person.entity";

export type Appointment = InferSelectModel<typeof appointment>
export type NewAppointment = InferInsertModel<typeof appointment>
export type AppointmentWithPerson = Appointment & {
    therapistPerson : ( TherapistPerson & {
            person: Person
        }
    )
} 
