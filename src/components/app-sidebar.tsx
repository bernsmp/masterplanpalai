import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar"
import { Calendar, Users, Settings, Home, Zap } from "lucide-react"
import Link from "next/link"

export function AppSidebar({ variant }: { variant?: "sidebar" | "floating" | "inset" }) {
  return (
    <Sidebar variant={variant}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#ffb829] to-[#e6a025] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold">PlanPal AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard">
                <Calendar className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/login">
                <Users className="w-4 h-4 mr-2" />
                Login
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
