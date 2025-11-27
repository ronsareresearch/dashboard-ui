"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Branding } from "./customs/branding/Branding"

// This is sample data.
const data = {
  user: {
    name: "Guru Accounting AI",
    email: "support@guruaccounting.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Main",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Home",
          url: "/dashboard/home",
        },
        {
          title: "WhatsApp",
          url: "/dashboard/whatsapp",
        },
        {
          title: "Knowledge Base",
          url: "/dashboard/knowledge-base",
        },
        {
          title: "Chat",
          url: "#",
        },
      ],
    },
    {
      title: "Services",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Tax Filing",
          url: "#",
        },
        {
          title: "Accounting",
          url: "#",
        },
        {
          title: "Immigration Service",
          url: "#",
        },
        {
          title: "Business Insurance",
          url: "#",
        },
        {
          title: "Payroll Management",
          url: "#",
        },
        {
          title: "Financial Advisory",
          url: "#",
        },
      ],
    },
    {
      title: "User Activity",
      url: "#",
      icon: BookOpen,
      items: [
           {
          title: "User Profile",
          url: "/dashboard/user-profile",
        },
        {
          title: "User Actions",
          url: "/dashboard/user-actions",
        },
        {
          title: "Activity Logs",
          url: "#",
        },
      ],
    },
    {
      title: "Profile",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
       
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({

  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Branding />
      </SidebarHeader>


      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
