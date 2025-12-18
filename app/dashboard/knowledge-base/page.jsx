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
import TopBar from "@/components/customs/top-bar/Topbar";

export default function KnowledgePage() {
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
        className={`flex-1 overflow-auto p-4 transition ${
          darkMode ? "bg-[#141416]" : "bg-gray-100"
        }`}
      >
        <ChatInterface darkMode={darkMode} />
      </main>
    </div>
  );
}
