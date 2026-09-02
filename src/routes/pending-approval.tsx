import { getCurrentSession } from '#/server/functions/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/pending-approval')({
    component: RouteComponent,
    beforeLoad: async ({location}) => {
        const session = await getCurrentSession()
    
        if(!session) throw redirect({ to:'/login' })
    
        if(session.isActive) throw redirect({to: '/dashboard'})
        return session
    }
})

async function RouteComponent() {
    return <div>
        We are sorry but your account was not approved yet 
    </div>
}
