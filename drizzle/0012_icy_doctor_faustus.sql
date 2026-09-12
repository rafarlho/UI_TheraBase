ALTER TABLE "therapist" ADD COLUMN "terms_accepted_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "therapist" ADD COLUMN "terms_version" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "therapist" ADD COLUMN "dpa_accepted_at" timestamp with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "therapist" ADD COLUMN "dpa_version" varchar(50) NOT NULL;