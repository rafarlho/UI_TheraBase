import Sidenav from '#/components/sidenav'
import { ThemeProvider } from '#/components/theme-provider'
import { SidebarProvider } from '#/components/ui/sidebar'
import { Toaster } from '#/components/ui/sonner'
import { TooltipProvider } from '#/components/ui/tooltip'
import { getCurrentSession } from '#/server/functions/auth'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({ 
  component: Home, 
  beforeLoad: async ({location}) => {
    const session = await getCurrentSession()
    
    console.log(location)

    if(!session) throw redirect(
    {   
        to:'/login',
        search: {redirect: location.href}
      }
    )
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
