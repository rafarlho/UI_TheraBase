import type { therapistPerson } from "#/db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type TherapistPerson = InferSelectModel<typeof therapistPerson>
export type NewTherapistPerson = InferInsertModel<typeof therapistPerson>