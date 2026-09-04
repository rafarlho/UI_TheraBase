import { Button } from '#/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { getCurrentSession } from '#/server/functions/auth'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/pending-approval')({
    component: RouteComponent,
    loader: async () => {
        const session = await getCurrentSession()
        if(!session) throw redirect({ to:'/login' })
    
        if(session.isActive) throw redirect({to: '/'})
        return session
    }
})

function RouteComponent() {
    const user = Route.useLoaderData()
    const navigate = useNavigate()
    return <div className="w-dvw h-dvh flex justify-center items-center bg-primary/50">
        <Card className='w-[50%] max-w-100'>
            <img alt="DB Logo" className='h-40 w-40 mx-auto' src={"/DB_Logo_Round.png"}/>
            <CardHeader>
                <CardTitle>Conta em aprovação</CardTitle>
                <CardDescription>
                    {user.name} pedimos desculpa, mas a tua conta para o email <b>{user.email}</b> ainda se encontra em aprovação.<br/>

                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button onClick={()=>  navigate({to: "/login"})}>Navegar para Login</Button>
            </CardFooter>
        </Card> 
    </div>
}
