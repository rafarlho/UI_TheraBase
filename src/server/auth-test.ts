import { createServerFn } from '@tanstack/react-start'
import { requireSession, requireTherapist } from '#/server/auth'

export const getCurrentUser = createServerFn({
  method: 'GET',
}).handler(async () => {
  const session = await requireSession()

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  }
})

export const getCurrentTherapist = createServerFn({
  method: 'GET',
}).handler(async () => {
  const therapist = await requireTherapist()

  return therapist
})
