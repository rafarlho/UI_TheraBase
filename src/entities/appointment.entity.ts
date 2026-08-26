import type { appointment } from "#/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Appointment = InferSelectModel<typeof appointment>
export type NewAppointment = InferSelectModel<typeof appointment>