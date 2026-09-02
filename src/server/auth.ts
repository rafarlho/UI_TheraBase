import { auth } from "#/lib/auth"
import { therapistRepository } from "#/repositories/therapist.repository"
import { getRequest } from "@tanstack/react-start/server"

export async function requireSession() {
    const request =  getRequest()
    const session = await auth.api.getSession({
        headers: request.headers
    })

    if(!session) throw new Error("Unauthorized")

    return session
}

export async function requireTherapist() {
    const session = await requireSession()
    const therapist = await therapistRepository.findByUserId(session.user.id)

    if(!therapist) throw new Error("Therapist not found")

    return therapist
}

