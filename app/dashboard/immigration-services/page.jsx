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

export default function ImmigrationPage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div
      className={`flex flex-col h-screen p-2 transition-colors duration-300 ${
        darkMode ? "bg-[#0C0C0D]" : "bg-gray-800"
      }`}
    >
      {/* HEADER */}
      <header
        className={`rounded-t-3xl flex justify-between py-2 px-6 shrink-0 items-center gap-2 transition ${
          darkMode ? "bg-[#1A1B1E]" : "bg-white"
        }`}
      >
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Immigartion Services</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className="hidden md:block" />

              <BreadcrumbItem>
                <BreadcrumbPage>Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          <ProfileNav />
        </div>
      </header>

      {/* MAIN CONTENT  */}
      <main
        className={`flex-1 overflow-auto p-4 rounded-b-3xl transition bg-gray-100`}
      >
       <ImmigrationBanner /> 
       <ImmigrationSearchUI />
      </main>
    </div>
  );
}
