import { personRepository } from "#/repositories/person.repository";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const getTherapistPatients = createServerFn({method: "GET"})
    .validator(z.object({therapistId: z.string().min(1)}))
    .handler(({data}) => {
        return personRepository.getPatientsByTherapistId(data.therapistId)
    })

export const getTherapistPatientsByName = createServerFn({method: "GET"})
    .validator(z.object({therapistId: z.string().min(1), name: z.string().optional()}))
    .handler(({data}) => {
        return personRepository.getPatientsByTherapistIdAndName(data.therapistId, data.name)
    })

export const getPatientOptions = createServerFn({method: "GET"})
    .validator(z.object({ therapistId: z.string().min(1) }))
    .handler(({data}) => personRepository.findPatientOptionsByTherapist(data.therapistId))


export const getPersonByName = createServerFn({method: "GET"})
    .validator(z.object({name: z.string().min(1)}))
    .handler(({data}) => {
        return personRepository.findByName(data.name)
    })

export const updatePatient = createServerFn({method: "POST"})
    .validator(z.object({
        id: z.string().min(1),
        name: z.string().optional(),
    }))
    .handler(({data}) => personRepository.update(data.id, data))

export const createPerson = createServerFn({method: "POST"})
    .validator(z.object({
        name: z.string().min(1),
    }))
    .handler(({data}) => personRepository.create(data))
