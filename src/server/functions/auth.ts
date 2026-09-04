import { auth } from "#/lib/auth";
import { therapistRepository } from "#/repositories/therapist.repository";
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

export const getCurrentTherapist = createServerFn({method:"GET"}).handler(async () => {
    const session = await getCurrentSession()
    if(!session) return undefined
    const therapist = await therapistRepository.findByUserId(session.id)

    if(!therapist) return undefined

    return therapist
})
