"use client";

import TaxFilingForm from "@/components/customs/tax-form/TaxFilingForm";
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
import Link from "next/link";

export default function TaxtFilingpage() {
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
                <Link href="/dashboard/home">
                  <BreadcrumbLink href="/dashboard/home">
                    Tax Filing
                  </BreadcrumbLink>
                </Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Register</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

      {/* Scrollable content */}
      <main className="flex-1 overflow-auto p-4 bg-gray-50 rounded-b-3xl">
       <TaxFilingForm />
      </main>
    </div>
  );
}
