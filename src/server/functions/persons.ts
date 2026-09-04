import { personRepository } from "#/repositories/person.repository";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { requireTherapist } from "../auth";
import { format } from "date-fns";

export const getTherapistPatients = createServerFn({method: "GET"})
    .handler(async () => {
        const therapist = await requireTherapist()
        return personRepository.getPatientsByTherapistId(therapist.id)
    })

export const getTherapistPatientsByName = createServerFn({method: "GET"})
    .validator(z.object({name: z.string().optional()}))
    .handler(async ({data}) => {
        const therapist = await requireTherapist()
        return personRepository.getPatientsByTherapistIdAndName(therapist.id, data.name)
    })

export const getPatientOptions = createServerFn({method: "GET"})
    .handler(async () => {
        const therapist = await requireTherapist()
        return personRepository.findPatientOptionsByTherapist(therapist.id)}
    )


export const getPersonByNameAndBirthDate = createServerFn({method: "GET"})
    .validator(z.object({name: z.string().min(1), birthDate: z.string().min(1)}))
    .handler(({data}) => {
        return personRepository.findByNameAndBirthDate(data.name, data.birthDate)
    })

export const updatePatient = createServerFn({method: "POST"})
    .validator(z.object({
        id: z.uuid(),
        name: z.string().optional(),
        birthDate: z.string().optional()

    }))
    .handler(({data}) => personRepository.update(data.id, {...data, birthDate: data.birthDate ?format(data.birthDate, "yyyy-MM-dd"): undefined}))

export const createPerson = createServerFn({method: "POST"})
    .validator(z.object({
        name: z.string().min(1),
        birthDate: z.date().min(1)
    }))
    .handler(({data}) => personRepository.create({...data, birthDate: format(data.birthDate, "yyyy-MM-dd")}))
