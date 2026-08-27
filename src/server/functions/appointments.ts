import { statusEnum } from "#/db/schema";
import { appointmentRepository } from "#/repositories/appointment.repository";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const getTodaysAppointmentsByTherapist = createServerFn({method: "GET"})
    .validator(z.object({therapistId: z.string().min(1)}))
    .handler(({data}) => {
        return appointmentRepository.findTodayByTherapist(data.therapistId)
    })

export const getByTherapistAndDate = createServerFn({method: "GET"})
    .validator(z.object({
        therapistId: z.string().min(1),
        startDate: z.date().min(1),
        endDate: z.date().min(1)
    }))
    .handler(({data}) => {
        return appointmentRepository.findByTherapistAndDate(data.therapistId, data.startDate, data.endDate)
    })


export const updateAppointment = createServerFn({method: "POST"})
    .validator(z.object({
        id: z.string().min(1),
        date: z.date().optional(),
        duration: z.number().optional(),
        status: z.enum(statusEnum.enumValues).optional(),
        notes: z.string().optional()
    }))
    .handler(({data}) => {
        return appointmentRepository.update(data.id, data)
    })