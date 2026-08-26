import type { therapist } from "#/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Therapist = InferSelectModel<typeof therapist>
export type NewTherapist = InferSelectModel<typeof therapist>