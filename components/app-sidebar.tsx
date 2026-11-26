"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Users,
  UserCheck,
  Package,
  Tag,
  Home,
  Settings,
  Award,
  Megaphone,
  FolderOpen,
  FileText,
  Newspaper,
  Gift,
  Mail,
  Image,
  Palette,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

type MenuItem = {
  id: number
  name: string
  route: string
}

const defaultMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Customers",
    url: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Admin",
    url: "/dashboard/admin",
    icon: Users,
  },
  {
    title: "Role",
    url: "/dashboard/role",
    icon: UserCheck,
  },
  {
    title: "Product",
    url: "/dashboard/product",
    icon: Package,
  },
  {
    title: "Brand",
    url: "/dashboard/brand",
    icon: Award,
  },
  {
    title: "Category",
    url: "/dashboard/category",
    icon: Tag,
  },
  {
    title: "Campaign",
    url: "/dashboard/campaign",
    icon: Megaphone,
  },
  {
    title: "Project",
    url: "/dashboard/project",
    icon: FolderOpen,
  },
  {
    title: "Material",
    url: "/dashboard/material",
    icon: FileText,
  },
  {
    title: "Press Release",
    url: "/dashboard/press-release",
    icon: Newspaper,
  },
  {
    title: "Promotion",
    url: "/dashboard/promotion",
    icon: Gift,
  },
  {
    title: "Contact Us",
    url: "/dashboard/contact-us",
    icon: Mail,
  },
  {
    title: "Logo",
    url: "/dashboard/logo",
    icon: Palette,
  },
]

const iconByRoute: Record<string, typeof Home> = {
  dashboard: Home,
  "dashboard/customers": Users,
  "dashboard/admin": Users,
  "dashboard/role": UserCheck,
  "dashboard/product": Package,
  "dashboard/brand": Award,
  "dashboard/category": Tag,
  "dashboard/campaign": Megaphone,
  "dashboard/project": FolderOpen,
  "dashboard/material": FileText,
  "dashboard/press-release": Newspaper,
  "dashboard/promotion": Gift,
  "dashboard/contact-us": Mail,
  "dashboard/logo": Palette,
}

const getSafeUrl = (route: string) => (route.startsWith("/") ? route : `/${route}`)

export function AppSidebar() {
  const [menuItems, setMenuItems] = useState(defaultMenuItems)

  useEffect(() => {
    const storedMenus = localStorage.getItem("user_menus")
    if (!storedMenus) return

    try {
      const parsedMenus: MenuItem[] = JSON.parse(storedMenus)
      if (!Array.isArray(parsedMenus) || parsedMenus.length === 0) return

      const dynamicMenus = parsedMenus.map((menu) => {
        const normalizedRoute = menu.route.replace(/^\//, "")
        return {
          title: menu.name,
          url: getSafeUrl(normalizedRoute),
          icon: iconByRoute[normalizedRoute] || FileText,
        }
      })

      setMenuItems(dynamicMenus)
    } catch (error) {
      console.error("Failed to parse user menus:", error)
    }
  }, [])

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarHeader className="border-b border-slate-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Admin Panel</h2>
            <p className="text-xs text-slate-500">Management System</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="w-full justify-start px-3 py-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
                  >
                    <Link href={item.url} className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-4">
        <div className="text-xs text-slate-500 text-center">© 2025 Marcomm Team</div>
      </SidebarFooter>
    </Sidebar>
  )
}
