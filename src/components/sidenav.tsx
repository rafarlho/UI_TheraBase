import { ChevronsLeft, ChevronsRight, Clock, FileUser, Home, Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./ui/sidebar"
import DBNameCharcoal from "@/assets/DBNameCharcoal.png"
import DBNameWhite from "@/assets/DBNameOffWhite.png"
import { Link } from "@tanstack/react-router"
import BetterAuthHeader from "#/integrations/better-auth/header-user"
import { useEffect, useState } from "react"

function Sidenav() {
    const { open, toggleSidebar} = useSidebar()
    const { resolvedTheme, setTheme }  = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(()=>setMounted(true),[])
    
    return (
        <Sidebar collapsible="icon" >
            <SidebarHeader className="flex flex-row items-center">
                {mounted && 
                    (open ? 
                        <img alt="Diana Botelho Logo" className="max-h-20" src={resolvedTheme==="light" ? DBNameCharcoal : DBNameWhite}/>
                        :
                        <img alt="Diana Botelho Logo" className="max-h-20" src="/DB_Logo_Round.png"/>
                    )
                }
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
                                {mounted && (
                                    <>
                                        {resolvedTheme === "light" ? <Moon/> : <Sun/>}
                                        {resolvedTheme === "light"  ? "Mudar para escuro" : "Mudar para claro"}
                                    </>
                                )}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex flex-col gap-5">
                    <BetterAuthHeader open={open}/>
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
