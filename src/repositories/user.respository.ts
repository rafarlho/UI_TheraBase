import { db } from "#/db"
import { user } from "#/db/auth-schema"
import { eq } from "drizzle-orm"

export const userRepository = {
    async findById(id:string) {
        return db.query.user.findFirst({where: eq(user.id, id)})
    }
}