import { Button } from '#/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { getCurrentSession, getCurrentTherapist } from '#/server/functions/auth'
import { createMyTherapistProfile } from '#/server/functions/therapist'
import { useRouter } from '@tanstack/react-router'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'

export const Route = createFileRoute('/register')({
    component: RouteComponent,
    loader: async ({location}) => {
        const session = await getCurrentSession()
        if(!session) throw redirect(
            {   
                to:'/login',
                search: {redirect: location.href}
            }
        )
    
        if(!session.isActive) throw redirect({to: '/pending-approval'})
    
        const therapist = await getCurrentTherapist()
    
        if(therapist) throw redirect({to: '/dashboard'})
        return session
    }
})

function RouteComponent() {

    const user = Route.useLoaderData()
    const navigate = useNavigate()
    const router = useRouter()

    const createMyTherapistProfileFn = useServerFn(createMyTherapistProfile)

    async function createProfile() {
        await createMyTherapistProfileFn({data: {name: user.name}})
        router.invalidate()

    }
    return <div className="w-dvw h-dvh flex justify-center items-center bg-primary/50">
        <Card className='w-[50%] max-w-100'>
            <img alt="DB Logo" className='h-40 w-40 mx-auto' src={"/DB_Logo_Round.png"}/>
            <CardHeader>
                <CardTitle>Bem-vind@ {user.name}</CardTitle>
                <CardDescription>
                    Parabéns, a tua conta foi aprovada para utilização!<br></br>Agora pode tratar de todos os teus pacientes numa só plataforma, clica no botão abaixo para navegares para a página principal.

                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button className='w-full' onClick={createProfile}>Vamos lá!</Button>
            </CardFooter>
        </Card> 
    </div>
}
