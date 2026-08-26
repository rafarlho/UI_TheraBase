import type { person } from "#/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Person = InferSelectModel<typeof person>
export type NewPerson = InferSelectModel<typeof person>