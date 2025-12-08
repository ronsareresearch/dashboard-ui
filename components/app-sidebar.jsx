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
      title: "Main",
      icon: SquareTerminal,
      permissionKey: "main",
      items: [
        { title: "Home", url: "/dashboard/home", key: "home" },
        { title: "WhatsApp", url: "/dashboard/whatsapp", key: "whatsapp" },
        { title: "Knowledge Base", url: "/dashboard/knowledge-base", key: "knowledge_base" },
      ],
    },
    {
      title: "Customer",
      icon: Bot,
      permissionKey: "customer",
      items: [
        { title: "Immigration Services", url: "/dashboard/immigration-services", key: "immigration_services" },
      ],
    },
    {
      title: "Emails",
      icon: Settings2,
      permissionKey: "emails",
      items: [
        { title: "Inbox", url: "/dashboard/email-inbox", key: "inbox" },
      ],
    },
    {
      title: "Documents",
      icon: BookOpen,
      permissionKey: "documents",
      items: [
        { title: "Forms", url: "/dashboard/user-profile", key: "forms" },
        { title: "Vault", url: "/dashboard/user-actions", key: "vault" },
        { title: "Search", url: "/dashboard/search", key: "search" },
      ],
    },
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
const filterNav = (nav, permissions) =>
  nav
    .map((group) => {
      const allowedItems = group.items.filter(
        (item) => permissions?.[group.permissionKey]?.[item.key]
      );
      if (!allowedItems.length) return null;
      return { ...group, items: allowedItems };
    })
    .filter(Boolean);

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

      <SidebarContent>
        <NavMain items={filteredNav} />
        <NavProjects projects={filteredProjects} />
      </SidebarContent>

      <SidebarFooter>
        <div className="w-full text-center py-4 border-t border-gray-600 flex flex-col items-center space-y-1">
          <span className="text-gray-400 text-xs">© 2025 All rights reserved</span>
          <span className="text-white/80 text-sm font-semibold">
            Developed by Ronsare
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
