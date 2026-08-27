DROP INDEX "therapist_person_id_idx";--> statement-breakpoint
ALTER TABLE "appointment" ALTER COLUMN "duration" SET DEFAULT 45;--> statement-breakpoint
CREATE INDEX "therapist_person_id_idx" ON "appointment" USING btree ("therapist_person_id");