import Sidenav from '#/components/sidenav'
import { ThemeProvider } from '#/components/theme-provider'
import { SidebarProvider, SidebarTrigger } from '#/components/ui/sidebar'
import { Toaster } from '#/components/ui/sonner'
import { TooltipProvider } from '#/components/ui/tooltip'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({ component: Home })

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
