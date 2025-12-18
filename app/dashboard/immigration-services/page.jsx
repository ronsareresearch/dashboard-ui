"use client";

import { useState } from "react";
import ChatInterface from "@/components/customs/ai-model-components/ChatInterface";
import ProfileNav from "@/components/customs/profile/ProfileNav";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Sun, Moon } from "lucide-react";
import ImmigrationBanner from "@/components/customs/immigration-services/ImmigrationBanner";
import ImmigrationSearchUI from "@/components/customs/immigration-services/ImmigrationSearchUI";
import TopBar from "@/components/customs/top-bar/Topbar";

export default function ImmigrationPage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#0C0C0D]" : "bg-gray-800"
      }`}
    >
      {/* HEADER */}
       <TopBar />
  

      {/* MAIN CONTENT  */}
      <main
        className={`flex-1 overflow-auto p-4 transition bg-gray-100`}
      >
       <ImmigrationBanner /> 
       <ImmigrationSearchUI />
      </main>
    </div>
  );
}
