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

export default function KnowledgePage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#0C0C0D]" : "bg-gray-800"
      }`}
    >
      {/* HEADER */}
      <header
        className={`flex justify-between py-2 px-6 shrink-0 items-center gap-2 transition ${
          darkMode ? "bg-[#1A1B1E]" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className="hidden md:block" />

              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* 🌗 Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm shadow-md transition ${
              darkMode
                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {darkMode ? "Light" : "Dark"}
          </button>

          <ProfileNav />
        </div>
      </header>

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
