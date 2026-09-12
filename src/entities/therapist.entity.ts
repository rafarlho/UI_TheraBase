import type { therapist } from "#/db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Therapist = InferSelectModel<typeof therapist>
export type NewTherapist = InferInsertModel<typeof therapist>