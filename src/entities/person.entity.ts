import type { person } from "#/db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { Therapist } from "./therapist.entity";

export type Person = InferSelectModel<typeof person>
export type NewPerson = InferInsertModel<typeof person>
export type PersonWithTherapist = Person & {
    therapistPersons: {
        therapist: Therapist 
    }
}