import { therapistPersonRepository } from "#/repositories/therapist-person.repository";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { requireTherapist } from "../auth";

export const addPatientToTherapist = createServerFn({method: "POST"})
    .validator(z.object({
        personId: z.uuid(),
        clinic: z.string().min(1),
        process: z.number().min(1),
        entity: z.string().min(1),
        therapeuticalDiagnosis: z.string().optional(),
        clinicalDiagnosis: z.string().optional(),
    }))
    .handler(async ({data}) => {
        const therapist = await requireTherapist()
        return therapistPersonRepository.create({
            therapistId: therapist.id, 
            personId: data.personId,
            clinic: data.clinic,
            process: data.process,
            entity: data.entity,
            clinicalDiagnosis: data.clinicalDiagnosis,
            therapeuticalDiagnosis: data.therapeuticalDiagnosis,
        })
    })

export const updateTherapistPerson  = createServerFn({method: "POST"})
    .validator(z.object({
        therapistPersonId: z.uuid(),
        clinic: z.string().optional(),
        process: z.number().optional(),
        entity: z.string().optional(),
        therapeuticalDiagnosis: z.string().optional(),
        clinicalDiagnosis: z.string().optional(),
    }))
    .handler(async ({data}) => {
        const therapist = await requireTherapist()
        return therapistPersonRepository.update(data.therapistPersonId, therapist.id, data)
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