"use client";

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

export default function KnowledgePage() {
  return (
    <div className="flex flex-col h-screen bg-gray-800 p-2">
      {/* Header with breadcrumb and toggle */}
      <header className="bg-white rounded-t-3xl flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-auto p-4 bg-gray-50 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-4">Knowledge</h1>
        <p>Welcome to the dashboard Knowledge page!</p>

        {/* Example content to demonstrate scrolling */}
        <div className="space-y-4 mt-4">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="p-4 bg-gray-200 rounded-lg">
              Content block {i + 1}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
