import { statusEnum } from "#/db/schema";
import { appointmentRepository } from "#/repositories/appointment.repository";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { requireTherapist } from "../auth";
import { therapistPersonRepository } from "#/repositories/therapist-person.repository";

export const getTodaysAppointmentsByTherapist = createServerFn({method: "GET"})
    .handler(async () => {
        const therapist = await requireTherapist()
        return appointmentRepository.findTodayByTherapist(therapist.id)
    })

export const getByTherapistAndDate = createServerFn({method: "GET"})
    .validator(z.object({
        startDate: z.date().min(1),
        endDate: z.date().min(1)
    }))
    .handler(async ({data}) => {
        const therapist = await requireTherapist()
        return appointmentRepository.findByTherapistAndDate(therapist.id, data.startDate, data.endDate)
    })


export const updateAppointment = createServerFn({method: "POST"})
    .validator(z.object({
        id: z.uuid(),
        date: z.date().optional(),
        duration: z.number().optional(),
        status: z.enum(statusEnum.enumValues).optional(),
        notes: z.string().optional()
    }))
    .handler(async ({data}) => {
        const therapist = await requireTherapist()
        const {id, ...changes} = data

        const updated = await appointmentRepository.update(id, therapist.id, changes)
        if(!updated) throw new Error("Appointment not found")
        return updated
    })

export const createAppointment = createServerFn({method: "POST"})
    .validator(z.object({
        location:  z.string().min(1),
        date: z.date(),
        duration: z.number(),
        therapistPersonId: z.uuid(),
        notes: z.string().optional(),
    }))
    .handler(async ({data}) => {
        const therapist = await requireTherapist()

        const therapistPerson = await therapistPersonRepository.findByIdForTherapist(data.therapistPersonId, therapist.id)
        if(!therapistPerson) throw new Error('Patient does not belong to therapist')

        return appointmentRepository.create(data)
    })