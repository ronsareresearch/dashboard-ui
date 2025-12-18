"use client";

import TopBar from "@/components/customs/top-bar/Topbar";
import UserProfile from "@/components/customs/user-management/UserProfile";
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

export default function UserProfilePage() {



    return (
        <div className="flex flex-col h-screen bg-gray-800">
            {/* HEADER */}
                <TopBar />
           

            {/* MAIN */}
            <main className="flex flex-1 p-2 overflow-hidden bg-white">
            <UserProfile />

            </main>
        </div>
    );
}
