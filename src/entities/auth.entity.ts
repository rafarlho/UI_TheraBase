import type { Session, User } from "better-auth"

export type SessionWithActive = Session & User &
{
  isActive: boolean
}