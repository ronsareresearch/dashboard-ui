"use client";

import SearchWithDropdown from "@/components/customs/search/SearchWithDropdown";
import RegisterModal from "@/components/customs/user-register/RegisterModal";
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
import { Briefcase, FileText, Shield, Users, DollarSign, Compass } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const services = [
    {
        name: "Tax Filing",
        description: "Easily file your taxes with expert guidance",
        icon: FileText,
        bgColor: "bg-blue-200",
        iconColor: "text-blue-600",
        redirect: "/dashboard/tax-filing",
    },
    {
        name: "Accounting",
        description: "Manage your accounts efficiently",
        icon: Briefcase,
        bgColor: "bg-green-200",
        iconColor: "text-green-600",
        redirect: "/dashboard/accounting-filing",
    },
    {
        name: "Immigration Service",
        description: "Visa and migration support",
        icon: Compass,
        bgColor: "bg-gray-200",
        iconColor: "text-gray-600",
        redirect: "/dashboard/immigration-service-filing",
    },
    {
        name: "Business Insurance",
        description: "Protect your business with ease",
        icon: Shield,
        bgColor: "bg-red-200",
        iconColor: "text-red-600",
        redirect: "/dashboard/business-insurance-filing",
    },
    {
        name: "Payroll Management",
        description: "Simplify employee payments",
        icon: DollarSign,
        bgColor: "bg-purple-200",
        iconColor: "text-purple-600",
        redirect: "/dashboard/payroll-management-filing",
    },
    {
        name: "Financial Advisory",
        description: "Get smart financial advice",
        icon: Users,
        bgColor: "bg-pink-200",
        iconColor: "text-pink-600",
        redirect: "/dashboard/financial-advisory-filing",
    },
];

const latestUsers = [
    { name: "John Doe", role: "Business Owner", date: "24 Nov", time: "10:22 AM" },
    { name: "Priya Sharma", role: "Accountant", date: "23 Nov", time: "05:10 PM" },
    { name: "Aman Verma", role: "Tax Consultant", date: "23 Nov", time: "11:44 AM" },
];

export default function UserProfilePage() {

    const [showRegister, setShowRegister] = useState(false);


    return (
        <div className="flex flex-col h-screen bg-gray-800 p-2">
            {/* HEADER */}
            <header className="bg-white rounded-t-3xl flex h-16 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">Services</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            {/* MAIN */}
            <main className="flex flex-1 overflow-hidden">

                {/* LEFT PANEL */}
                <div className="flex-1 max-w-[50%] p-4 bg-gray-100 rounded-bl-3xl flex flex-col overflow-hidden">

                    {/* SEARCH + REGISTER (fixed) */}
                    <div className="flex items-center gap-4 mb-4 shrink-0">
                        {/* <input
              type="text"
              placeholder="Search services..."
              className="flex-1 px-6 py-4 text-lg rounded-xl border border-gray-300 shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> */}
                        <SearchWithDropdown />
                        <div>
                            {/* YOUR BUTTON */}
                            <button
                                onClick={() => setShowRegister(true)}
                                className="px-6 py-4 bg-gray-800 text-white rounded-xl text-lg 
          font-medium hover:bg-gray-700 shadow-md"
                            >
                                Register
                            </button>

                            <RegisterModal
                                open={showRegister}
                                onClose={() => setShowRegister(false)}
                                onRegister={(data) => {
                                    console.log("User Registered:", data);
                                }}
                            />
                        </div>
                    </div>

                    {/* CONTENT WRAPPER (keeps both halves fixed height, scroll inside only) */}
                    <div className="flex flex-col h-full overflow-hidden">


                        {/* USERS (50%) */}
                        <div className="h-full mt-4 overflow-hidden pr-2">
                            <div
                                className="bg-white/70 backdrop-blur-xl p-5 rounded-3xl 
               shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/20 
               h-full flex flex-col"
                            >
                                <div className="flex justify-between items-center mb-4 px-2">
                                    {/* Heading (fixed) */}
                                    <h2 className="text-xl font-semibold  text-gray-900 tracking-tight shrink-0">
                                        Latest Registered Users
                                    </h2>
                                    <Link href="/dashboard/user-profile" className="text-blue-800 cursor-pointer">See More</Link>
                                </div>

                                {/* Scrollable list */}
                                <div className="space-y-3 overflow-y-auto pr-1 pb-4">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const user = latestUsers[i];

                                        return (
                                            <div
                                                key={i}
                                                className="group flex items-center justify-between p-4 rounded-2xl 
                       bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)] 
                       border border-gray-100
                       hover:shadow-[0_4px_18px_rgba(0,0,0,0.08)] 
                       hover:bg-gray-50 transition-all cursor-pointer"
                                            >
                                                {user ? (
                                                    <>
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-11 h-11 rounded-2xl bg-gray-100 text-gray-700 
                                  flex items-center justify-center font-semibold shadow-inner">
                                                                {user.name.charAt(0)}
                                                            </div>

                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-gray-900">{user.name}</span>
                                                                <span className="text-xs text-gray-500">{user.role}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-end text-xs text-gray-500">
                                                            <span>{user.date ?? "—"}</span>
                                                            <span>{user.time ?? "—"}</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="w-full flex items-center justify-center text-gray-400 text-sm py-6">
                                                        Not Registered
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                {/* RIGHT PANEL — USER PROFILE */}
                <div className="w-[50%] h-full py-4 pr-4 bg-gray-100 backdrop-blur-xl rounded-br-3xl flex flex-col">
                    <div className="p-4 bg-white h-full rounded-2xl flex flex-col overflow-hidden">

                        {/* HEADER (fixed) */}
                        <div className="space-y-6 shrink-0">
                            <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>

                            {/* USER CARD */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gray-200
                        flex items-center justify-center text-2xl text-gray-700 font-semibold shadow-inner">
                                    A
                                </div>

                                <div>
                                    <h3 className="text-xl font-medium text-gray-900">Aman Gupta</h3>
                                    <p className="text-sm text-gray-500">Customer</p>
                                </div>
                            </div>

                            {/* BASIC DETAILS */}
                            <div className="space-y-3">
                                <div className="p-4 bg-white shadow-sm border border-gray-200 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">Email</p>
                                    <p className="text-gray-800">aman.gupta@example.com</p>
                                </div>

                                <div className="p-4 bg-white shadow-sm border border-gray-200 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">Joined On</p>
                                    <p className="text-gray-800">26 Nov 2025</p>
                                </div>

                                <div className="p-4 bg-white shadow-sm border border-gray-200 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">Status</p>
                                    <p className="font-medium text-green-600">Active</p>
                                </div>
                            </div>
                        </div>

                        {/* SCROLLABLE CONTENT */}
                        <div className="flex-1 mt-4 overflow-y-auto pr-1 space-y-6">
                            {/* DOCUMENTS */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">Documents</h4>
                                <div className="space-y-2">
                                    <div className="p-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-sm">
                                        <span className="text-gray-800 font-medium">Passport.pdf</span>
                                        <span className="text-xs text-gray-500">26 Nov 2025</span>
                                    </div>
                                    <div className="p-3 bg-white border border-gray-200 rounded-xl flex justify-between items-center shadow-sm">
                                        <span className="text-gray-800 font-medium">Tax_Form_2025.pdf</span>
                                        <span className="text-xs text-gray-500">27 Nov 2025</span>
                                    </div>
                                </div>
                            </div>

                            {/* ACTIVITY HISTORY */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">Activity History</h4>
                                <div className="space-y-3">
                                    {Array.from({ length: 7 }).map((_, i) => (
                                        <div key={i} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                                            <p className="text-gray-800 font-medium">Updated profile details</p>
                                            <p className="text-xs text-gray-500">27 Nov 2025, 10:05 AM</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>





            </main>
        </div>
    );
}
