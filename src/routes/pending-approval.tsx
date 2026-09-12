import { Button } from '#/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { getCurrentSession } from '#/server/functions/auth'
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router'

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
            <CardFooter className='flex flex-col'>
                <Button onClick={()=>  navigate({to: "/login"})}>Navegar para Login</Button>
                <div className="mt-5 pt-6 border-t border-border flex gap-4 text-sm text-muted-foreground flex-row flex-wrap w-full">
                    <Link to="/privacy" className="underline hover:text-foreground">
                        Política de Privacidade
                    </Link>
                    <Link to="/terms" className="underline hover:text-foreground">
                        Termos de Serviço
                    </Link>
                    <Link to="/dpa" className="underline hover:text-foreground">
                        Acordo de Tratamento de Dados
                    </Link>
                </div>
            </CardFooter>
        </Card> 
    </div>
}
