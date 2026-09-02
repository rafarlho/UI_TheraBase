import { therapistRepository } from "#/repositories/therapist.repository";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { requireSession } from "../auth";

export const createMyTherapistProfile = createServerFn({method: "POST"})
    .validator(z.object({name: z.string().trim().min(1).max(255)}))
    .handler(async ({data}) =>{
        const session = await requireSession()
        const existing = await therapistRepository.findByUserId(session.user.id)
        
        if(existing) return existing

        return therapistRepository.create({
            userId:session.user.id,
            name: data.name
        })
    })