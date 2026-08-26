import { appointmentRepository } from "#/repositories/appointment.repository";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const getTodaysAppointmentsByTherapist = createServerFn({method: "GET"})
    .validator(z.object({therapistId: z.string().min(1)}))
    .handler(({data}) => {
        return appointmentRepository.findTodayByTherapist(data.therapistId)
    })