"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen">
        {/* Sidebar stays mounted */}
        <AppSidebar />

        {/* Right panel: full remaining width */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
