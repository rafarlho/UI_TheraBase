ALTER TABLE "person" ADD COLUMN "birth_date" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "therapist_person" ADD COLUMN "clinic" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "therapist_person" ADD COLUMN "process" numeric NOT NULL;--> statement-breakpoint
ALTER TABLE "therapist_person" ADD COLUMN "entity" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "therapist_person" ADD COLUMN "therapeutical-diagnosis" varchar;--> statement-breakpoint
ALTER TABLE "therapist_person" ADD COLUMN "therapeutical-clinical" varchar;--> statement-breakpoint
ALTER TABLE "appointment" DROP COLUMN "location";