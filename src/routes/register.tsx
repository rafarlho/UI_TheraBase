import { Button } from '#/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '#/components/ui/card'
import { getCurrentSession, getCurrentTherapist } from '#/server/functions/auth'
import { createMyTherapistProfile } from '#/server/functions/therapist'
import { Link, useRouter } from '@tanstack/react-router'
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
    
        if(therapist) throw redirect({to: '/'})
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
            <CardFooter className='flex flex-col'>
                <p className='font-bold'>Ao clicar no botão, aceitas as políticas de privacidade, termos de serviço e acordo de proteção de dados.</p>
                <Button className='w-full' onClick={createProfile}>Vamos lá!</Button>
                <div className="mt-5 pt-6 border-t border-border flex gap-4 text-sm text-muted-foreground flex-row flex-wrap w-full">
                    <Link to="/privacy" target='_blank' className="underline hover:text-foreground">
                        Política de Privacidade
                    </Link>
                    <Link to="/terms" target='_blank' className="underline hover:text-foreground">
                        Termos de Serviço
                    </Link> 
                    <Link to="/dpa" target='_blank' className="underline hover:text-foreground">
                        Acordo de Tratamento de Dados
                    </Link>
                </div>
            </CardFooter>
        </Card> 
    </div>
}
