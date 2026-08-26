import { therapistPersonRepository } from "#/repositories/therapist-person.repository";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const addPatientToTherapist = createServerFn({method: "POST"})
    .validator(z.object({therapistId: z.string().min(1), personId: z.string().min(1)}))
    .handler(({data}) => therapistPersonRepository.create({therapistId: data.therapistId, personId: data.personId}))

export const removePatientFromTherapist = createServerFn({method: "POST"})
    .validator(z.object({therapistId: z.string().min(1), personId: z.string().min(1)}))
    .handler(({data}) => therapistPersonRepository.deactivateByIds(data.therapistId, data.personId))

export const getTherapistPatientsById = createServerFn({method: "GET"})
    .validator(z.object({therapistId: z.string().min(1), personId: z.string().min(1)}))
    .handler(({data}) => {
        return therapistPersonRepository.getPatientsByTherapistIdAndPersonId(data.therapistId, data.personId)
    })

export const enableTherapistPerson = createServerFn({method: "POST"})
    .validator(z.object({id: z.string().min(1)}))
    .handler(({data}) => therapistPersonRepository.update(data.id, {active:true}))    