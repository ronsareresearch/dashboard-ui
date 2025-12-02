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
      ],
    },
    {
      title: "Customer",
      url: "#",
      icon: Bot,
      items: [
        //    {
        //   title: "Business Insurance",
        //   url: "#",
        // },
        // {
        //   title: "Tax Filing",
        //   url: "#",
        // },
        // {
        //   title: "Accounting",
        //   url: "#",
        // },
        {
          title: "Immigration Services",
          url: "/dashboard/immigration-services",
        },

        // {
        //   title: "Payroll Management",
        //   url: "#",
        // },
        // {
        //   title: "Financial Advisory",
        //   url: "#",
        // },
      ],
    },
     {
      title: "Emails",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "inbox",
          url: "/dashboard/email-inbox",
        },
      ],
    },
    {
      title: "Documents",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Forms",
          url: "/dashboard/user-profile",
        },
        // {
        //   title: "User Actions",
        //   url: "/dashboard/user-actions",
        // },
        // {
        //   title: "Activity Logs",
        //   url: "#",
        // },
      ],
    },
   
    {
      title: "User Management",
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
      name: "Docs",
      url: "#",
      icon: Frame,
    },
    {
      name: "Marketing Material",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Holidays",
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
        <div className="w-full text-center py-4 border-t border-gray-600 flex flex-col items-center space-y-1">
          <span className="text-gray-400 text-xs">© 2025 All rights reserved</span>
          <span className="text-white/80 text-sm font-semibold">Developed by Ronsare</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
