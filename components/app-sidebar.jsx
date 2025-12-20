"use client";

import * as React from "react";
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
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Branding } from "./customs/branding/Branding";
import { useAuthUser } from "@/app/lib/useAuthUser";

// ✅ STATIC NAV CONFIG (NO PERMISSIONS HERE)
const rawNav = {
  navMain: [
    {
      title: "Home",
      icon: SquareTerminal,
      permissionKey: "home",
      items: [
        { title: "Dashboard", url: "/dashboard/home", key: "dashboard" },
        { title: "Knowledge Base", url: "/dashboard/knowledge-base", key: "knowledge_base" },
      ],
    },
    {
      title: "Workspaces",
      icon: Settings2,
      permissionKey: "workspaces",
      items: [
        { title: "Doc Storage", url: "/dashboard/upload-file", key: "doc_storage" },
        { title: "Emails", url: "/dashboard/email-inbox", key: "emails" },
        { title: "WhatsApp", url: "/dashboard/whatsapp", key: "whatsapp" },
      ],
    },
    {
      title: "Services",
      icon: Bot,
      permissionKey: "services",
      items: [
        {
          title: "Immigration Services",
          url: "/dashboard/immigration-services",
          key: "immigration_services",
        },
      ],
    },
    {
      title: "User Management",
      icon: Settings2,
      permissionKey: "user_management",
      items: [
        { title: "General", url: "/dashboard/general", key: "general" },
        { title: "Settings", url: "/dashboard/settings", key: "settings" },
      ],
    },
  ],
    projects: [
    { name: "Docs", icon: Frame, key: "docs" },
    { name: "Marketing Material", icon: PieChart, key: "marketing_material" },
    { name: "Holidays", icon: Map, key: "holidays" },
  ],
};


const filterNav = (nav, permissions) => {
  return nav
    .map((group) => {
      const groupPerm = permissions?.[group.permissionKey];
      if (!groupPerm) return null;

      const items = group.items.filter(
        (item) => groupPerm[item.key] === true
      );

      if (!items.length) return null;

      return { ...group, items };
    })
    .filter(Boolean);
};



export function AppSidebar(props) {
  const { user, loading } = useAuthUser();

  const filteredNav = React.useMemo(() => {
    if (!user?.permissions) return [];
    return filterNav(rawNav.navMain, user.permissions);
  }, [user]);

  const filteredProjects = React.useMemo(() => {
    if (!user?.permissions?.resources) return [];
    return rawNav.projects.filter(
      (proj) => user.permissions.resources?.[proj.key]
    );
  }, [user]);

  if (loading) return null; // prevent flicker

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Branding />
      </SidebarHeader>
      {/* <div className="h-42 flex items-center justify-center">
      </div> */}
      <SidebarContent>
        <NavMain items={filteredNav} />
        <NavProjects projects={filteredProjects} />
      </SidebarContent>

      <SidebarFooter>
        <div className="w-full text-center py-4 border-t border-gray-200 flex flex-col items-center space-y-1">
          <span className="text-gray-400 text-xs">© 2025 All rights reserved</span>
          <span className="text-white/80 text-sm font-semibold">
            Developed by Ronsare
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
