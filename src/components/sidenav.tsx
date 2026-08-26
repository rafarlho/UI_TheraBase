import { ChevronsLeft, ChevronsRight, Clock, Home } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, SidebarTrigger, useSidebar } from "./ui/sidebar"
import DB_Logo from "@/assets/DB_Logo.svg"
import DB_Logo_White from "@/assets/DB_Logo_White.svg"
import { Link } from "@tanstack/react-router"

function Sidenav() {
    const {resolvedTheme} = useTheme()
    const {
        open,
        toggleSidebar,
    } = useSidebar()
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
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div>
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
