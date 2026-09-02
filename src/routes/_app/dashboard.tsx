import { getTodaysAppointmentsByTherapist } from '#/server/functions/appointments'
import { getTherapistPatients } from '#/server/functions/persons'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/dashboard')({
  component: RouteComponent,
  loader: async () => {
    const [appointments, patients] = await Promise.all([
      getTodaysAppointmentsByTherapist(),
      getTherapistPatients()
    ])
    return {appointments, patients}
  }
})

function RouteComponent() {
  const {appointments, patients} = Route.useLoaderData()
  return <div>
    {appointments.length} appointments and 
    {patients.length} patitens...
  </div>
}
