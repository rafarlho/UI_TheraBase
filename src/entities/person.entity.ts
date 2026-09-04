import type { person } from "#/db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { Therapist } from "./therapist.entity";
import type { TherapistPerson } from "./therapist-person.entity";

export type Person = InferSelectModel<typeof person>
export type NewPerson = InferInsertModel<typeof person>
export type PersonWithTherapist = Person & {
  therapistPerson: (TherapistPerson & {
    therapist: Therapist
  }) | null
}