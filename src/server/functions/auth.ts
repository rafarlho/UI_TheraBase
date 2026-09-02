import type { SessionWithActive } from "#/entities/auth.entity";
import { auth } from "#/lib/auth";
import { userRepository } from "#/repositories/user.respository";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export const getCurrentSession = createServerFn({method:"GET"}).handler(async () => {
    const request = getRequest()
    const sessionData = await auth.api.getSession({headers: request.headers})
    if(!sessionData) return undefined
    
    const user = await userRepository.findById(sessionData.user.id)
    if(!user) return undefined
    return {...sessionData.session, ...user, isActive: user.isActive}
})