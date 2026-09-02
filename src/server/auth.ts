import { auth } from "#/lib/auth"
import { therapistRepository } from "#/repositories/therapist.repository"
import { userRepository } from "#/repositories/user.respository"
import { getRequest } from "@tanstack/react-start/server"

export async function requireSession() {
    const request =  getRequest()
    const session = await auth.api.getSession({
        headers: request.headers
    })

    if(!session) throw new Error("Unauthorized")

    const user = await userRepository.findById(session.user.id)

    return {...session, isActive: user?.isActive}
}

export async function requireTherapist() {
    const session = await requireSession()
    const therapist = await therapistRepository.findByUserId(session.user.id)

    if(!therapist) throw new Error("Therapist not found")

    return therapist
}

