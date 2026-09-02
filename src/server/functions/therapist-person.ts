import { therapistPersonRepository } from "#/repositories/therapist-person.repository";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { requireTherapist } from "../auth";

export const addPatientToTherapist = createServerFn({method: "POST"})
    .validator(z.object({personId: z.uuid()}))
    .handler(async ({data}) => {
        const therapist = await requireTherapist()
        return therapistPersonRepository.create({therapistId: therapist.id, personId: data.personId})
    })

export const removePatientFromTherapist = createServerFn({method: "POST"})
    .validator(z.object({personId: z.uuid()}))
    .handler(async ({data}) => {
        const therapist = await requireTherapist()
        return therapistPersonRepository.deactivateByIds(therapist.id, data.personId)
    })

export const getTherapistPatientsById = createServerFn({method: "GET"})
    .validator(z.object({personId: z.uuid()}))
    .handler(async ({data}) => {
        const therapist = await requireTherapist()
        return therapistPersonRepository.getPatientsByTherapistIdAndPersonId(therapist.id, data.personId)
    })

export const enableTherapistPerson = createServerFn({method: "POST"})
    .validator(z.object({id: z.uuid()}))
    .handler(async ({data}) => {
        const therapist = await requireTherapist()
        return therapistPersonRepository.update(data.id, therapist.id, {active:true})
    }) 