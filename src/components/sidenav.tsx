import { ChevronsLeft, ChevronsRight, Clock, FileUser, Home, Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "./ui/sidebar"
import DB_Logo from "@/assets/DB_Logo.svg"
import DB_Logo_White from "@/assets/DB_Logo_White.svg"
import { Link } from "@tanstack/react-router"
import BetterAuthHeader from "#/integrations/better-auth/header-user"
import { getCurrentTherapist, getCurrentUser } from "#/server/auth-test"
import { createMyTherapistProfile } from "#/server/functions/therapist"

function Sidenav() {
    const { open, toggleSidebar} = useSidebar()
    const { resolvedTheme, setTheme }  = useTheme()
    return (
        <Sidebar collapsible="icon" >
            <SidebarHeader className="flex flex-row items-center">
                <img alt="Diana Botelho Logo" className="max-h-20" src={resolvedTheme==="light" ? DB_Logo : DB_Logo_White}/>
                <span className="group-data-[collapsible=icon]:hidden font-heading">
                    <h1 className="font-bold text-xl">Diana Botelho</h1>
                    <h5>Terapeuta da fala</h5>
                </span>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navegação</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link to={"/dashboard"}>
                                    <Home/>
                                    <span>Página Principal</span>
                                </Link>
                            </SidebarMenuButton>
                            <SidebarMenuButton asChild>
                                <Link to={"/schedule"}>
                                    <Clock/>
                                    <span>Agenda</span>
                                </Link>
                            </SidebarMenuButton>
                            <SidebarMenuButton asChild>
                                <Link to={"/patients"}>
                                    <FileUser/>
                                    <span>Pacientes</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Acessibilidade</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton onClick={() => (setTheme(resolvedTheme === "light" ? "dark": "light"))}>
                                    {resolvedTheme === "light" ? <Moon/> : <Sun/>}
                                    {resolvedTheme === "light" ? "Mudar para escuro" : "Mudar para claro"}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div>
                    <button
  onClick={async () => {
    const user = await getCurrentUser()
    console.log(user)
    const therapist = await getCurrentTherapist()
    console.log(therapist)

  }}
>
  Test server session
</button>
<button
  onClick={async () => {
    try {
      const user = await getCurrentUser()
      console.log('USER:', user)

      const therapist = await createMyTherapistProfile({
        data: {
          name: user.name,
        },
      })

      console.log('THERAPIST CREATED:', therapist)

      const currentTherapist = await getCurrentTherapist()
      console.log('CURRENT THERAPIST:', currentTherapist)
    } catch (error) {
      console.error(error)
    }
  }}
>
  Create/test therapist
</button>
                    <BetterAuthHeader/>
                    <SidebarMenuButton onClick={toggleSidebar} className="flex justify-end">
                        <span>Ocultar</span>
                        {open ? <ChevronsLeft/> : <ChevronsRight/>}
                    </SidebarMenuButton>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}

export default Sidenav
