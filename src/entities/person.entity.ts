import type { person } from "#/db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Person = InferSelectModel<typeof person>
export type NewPerson = InferInsertModel<typeof person>