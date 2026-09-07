import Sidenav from '#/components/sidenav'
import { ThemeProvider } from '#/components/theme-provider'
import { SidebarProvider } from '#/components/ui/sidebar'
import { Toaster } from '#/components/ui/sonner'
import { TooltipProvider } from '#/components/ui/tooltip'
import { getCurrentSession, getCurrentTherapist } from '#/server/functions/auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({ 
  component: Home, 
  beforeLoad: async ({location}) => {
    const session = await getCurrentSession()
    if(!session) throw redirect(
    {   
        to:'/login',
        search: {redirect: location.href}
      }
    )

    if(!session.isActive) throw redirect({to: '/pending-approval'})

    const therapist = await getCurrentTherapist()

    if(!therapist) throw redirect({to: '/register'})
    return session
  }
})

function Home() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <SidebarProvider>
          <Sidenav/>
          <main className='flex grow'>
            <Outlet/>
            <Toaster/>
          </main>
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
