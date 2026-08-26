import type { therapistPerson } from "#/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type TherapistPerson = InferSelectModel<typeof therapistPerson>
export type NewTherapistPerson = InferSelectModel<typeof therapistPerson>