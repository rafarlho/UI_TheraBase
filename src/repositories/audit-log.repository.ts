import { db } from "#/db"
import { auditLog } from "#/db/schema"

type LogProps = {
    therapistId: string,
    action: "create" | "update" | "delete",
    entityType: "person" | "therapist_person" | "appointment",
    entityId: string
}

export const auditLogRepository = {
    async log(params: LogProps): Promise<void> {
        await db.insert(auditLog).values(params)
    }
}