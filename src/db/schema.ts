import { relations } from 'drizzle-orm'
import { boolean, index, integer, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

export const statusEnum = pgEnum("status", ["not_started", "finished", "canceled"])

export const therapist = pgTable("therapist", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({length:255}).notNull(),

  // Connects user to therapist
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  
  active: boolean().notNull().default(true),
  createdAt: timestamp("created_at",{withTimezone: true}).defaultNow().notNull(),
  updatedAt: timestamp("updated_at",{withTimezone: true}).defaultNow().notNull().$onUpdate(() => new Date()),
})


export const person = pgTable("person", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({length:255}).notNull(),
  active: boolean().notNull().default(true),
  createdAt: timestamp("created_at",{withTimezone: true}).defaultNow().notNull(),
  updatedAt: timestamp("updated_at",{withTimezone: true}).defaultNow().notNull().$onUpdate(() => new Date()),
})

export const therapistPerson = pgTable("therapist_person", {
    id: uuid().primaryKey().defaultRandom(),
    therapistId: uuid("therapist_id").notNull().references(()=> therapist.id),
    personId: uuid("person_id").notNull().references(()=> person.id),

    active: boolean().notNull().default(true),
    createdAt: timestamp("created_at",{withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp("updated_at",{withTimezone: true}).defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (table) => ({
    therapistPersonUnique: uniqueIndex("therapist_person_unique").on(table.therapistId, table.personId)
  })
)

export const appointment = pgTable("appointment", {
    id: uuid().primaryKey().defaultRandom(),
    location: varchar({length:255}).notNull(),
    date: timestamp({withTimezone:true}).notNull(),
    notes: text("notes"),
    duration: integer().notNull().default(45),
    therapistPersonId: uuid("therapist_person_id").notNull().references(() => therapistPerson.id),
    status: statusEnum().notNull().default("not_started"),
    createdAt: timestamp("created_at",{withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp("updated_at",{withTimezone: true}).defaultNow().notNull().$onUpdate(() => new Date()),
  },
  (table) => ({
    therapistPersonIdIdx: index("therapist_person_id_idx").on(table.therapistPersonId)
  })
)

// Relation definitions
export const therapistRelations = relations(therapist, ({many}) => ({
  therapistPersons: many(therapistPerson)
}))

export const personRelations = relations(person, ({many}) => ({
  therapistPersons: many(therapistPerson)
}))

export const therapistPersonRelations = relations(therapistPerson, ({one,many}) => ({
  therapist: one(therapist, {
    fields: [therapistPerson.therapistId],
    references: [therapist.id]
  }),
  person: one(person, {
    fields: [therapistPerson.personId],
    references: [person.id]
  }),
  appointments: many(appointment)
}))

export const appointmemtRelations = relations(appointment, ({one}) => ({
  therapistPerson: one(therapistPerson, {
    fields: [appointment.therapistPersonId],
    references: [therapistPerson.id]
  }),
}))