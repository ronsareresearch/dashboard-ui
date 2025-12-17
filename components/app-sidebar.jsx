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
      permissionKey: "main",
      items: [
        { title: "Home", url: "/dashboard/home", key: "home" },
        { title: "Knowledge Base", url: "/dashboard/knowledge-base", key: "knowledge_base" },
        { title: "upload-file", url: "/dashboard/upload-file", key: "knowledge_base" },
      ],
    },
        {
      title: "Workspaces",
      icon: Settings2,
      permissionKey: "emails",
      items: [
        { title: "Emails", url: "/dashboard/email-inbox", key: "inbox" },
        { title: "WhatsApp", url: "/dashboard/whatsapp", key: "whatsapp" },
      ],
    },
    {
      title: "Services",
      icon: Bot,
      permissionKey: "customer",
      items: [
        { title: "Immigration Services", url: "/dashboard/immigration-services", key: "immigration_services" },
      ],
    },

    // {
    //   title: "Documents",
    //   icon: BookOpen,
    //   permissionKey: "documents",
    //   items: [
    //     { title: "Forms", url: "/dashboard/user-profile", key: "forms" },
    //     { title: "Vault", url: "/dashboard/user-actions", key: "vault" },
    //     { title: "Search", url: "/dashboard/search", key: "search" },
    //   ],
    // },
    {
      title: "User Management",
      icon: Settings2,
      permissionKey: "user_management",
      items: [
        { title: "General", url: "/dashboard/general", key: "general" },
        { title: "Settings", url: "#", key: "settings" },
      ],
    },
  ],

  projects: [
    { name: "Docs", icon: Frame, key: "docs" },
    { name: "Marketing Material", icon: PieChart, key: "marketing_material" },
    { name: "Holidays", icon: Map, key: "holidays" },
  ],
};

// ✅ FILTER ENGINE
const filterNav = (nav, permissions) => {
  return nav
    .map((group) => {
      let groupPerm = permissions?.[group.permissionKey];

      // ✅ TEMP FIX: If main.whatsapp is true → force allow emails group
      if (permissions?.main?.whatsapp === true && group.permissionKey === "emails") {
        groupPerm = {
          inbox: true,
          whatsapp: true,
        };
      }

      // normal filtering
      const allowedItems = group.items.filter(
        (item) => groupPerm?.[item.key]
      );

      if (!allowedItems.length) return null;

      return { ...group, items: allowedItems };
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
      <div className="h-[200px]"></div>
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
