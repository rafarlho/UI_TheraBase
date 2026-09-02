import type { SessionWithActive } from "#/entities/auth.entity";
import { auth } from "#/lib/auth";
import { userRepository } from "#/repositories/user.respository";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const getCurrentSession = createServerFn({method:"GET"}).handler(async () => {
    const request = getRequest()
    const session = await auth.api.getSession({headers: request.headers})
    const user = await userRepository.findById(session!.user.id)
    
    return {...session,...user, isActive: user!.isActive} as SessionWithActive
})