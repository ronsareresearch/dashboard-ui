"use client";

import { AUTH_SERVER } from "@/app/constant/constant";
import AiModel from "@/components/customs/ai-model-components/AiModel";
import ProfileNav from "@/components/customs/profile/ProfileNav";
import TopBar from "@/components/customs/top-bar/Topbar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Briefcase, FileText, Shield, Users, DollarSign, Compass, UserIcon, Edit2, LogOut, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const services = [
  {
    name: "Immigration Services",
    description: "Visa and migration support",
    icon: Compass,
    bgColor: "bg-gray-200",
    iconColor: "text-gray-600",
    redirect: "/dashboard/immigration-service-filing",
  },
  {
    name: "Tax Filing",
    description: "Easily file your taxes with expert guidance",
    icon: FileText,
    bgColor: "bg-gray-200",
    iconColor: "text-blue-600",
    redirect: "/dashboard/tax-filing",
  },
  {
    name: "Accounting",
    description: "Manage your accounts efficiently",
    icon: Briefcase,
    bgColor: "bg-gray-200",
    iconColor: "text-green-600",
    redirect: "/dashboard/accounting-filing",
  },

  {
    name: "Business Insurance",
    description: "Protect your business with ease",
    icon: Shield,
    bgColor: "bg-gray-200",
    iconColor: "text-red-600",
    redirect: "/dashboard/business-insurance-filing",
  },
  {
    name: "Payroll Management",
    description: "Simplify employee payments",
    icon: DollarSign,
    bgColor: "bg-gray-200",
    iconColor: "text-purple-600",
    redirect: "/dashboard/payroll-management-filing",
  },
  {
    name: "Financial Advisory",
    description: "Get smart financial advice",
    icon: Users,
    bgColor: "bg-gray-200",
    iconColor: "text-pink-600",
    redirect: "/dashboard/financial-advisory-filing",
  },
];

const users = [
  { name: "John Doe", email: "I4f5e@example.com", role: "Business Owner", date: "24 Nov", time: "10:22 AM" },
  { name: "Jane Smith", email: "6dL0m@example.com", role: "Accountant", date: "24 Nov", time: "10:22 AM" },
  { name: "Mike Johnson", email: "3Pn9x@example.com", role: "CEO", date: "24 Nov", time: "10:22 AM" },
  { name: "Emily Davis", email: "jwS6C@example.com", role: "Tax Consultant", date: "24 Nov", time: "10:22 AM" },
  { name: "Alex Wilson", email: "tqE6w@example.com", role: "HR Manager", date: "24 Nov", time: "10:22 AM" },

]

export default function HomePage() {
  const router = useRouter();
  const [status, setStatus] = useState("active"); // "active" or "offline"



  // top to bottom nav devider 
  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <TopBar />
      {/* MAIN */}
      <main className="flex flex-1 overflow-hidden">

        {/* LEFT PANEL */}
        <div className="flex-1 max-w-[75%]  bg-white flex flex-col overflow-hidden">

          <div className="h-[200px] relative flex justify-center items-center" style={{ backgroundImage: 'url(/background-img/banner.svg)', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
            <div className="absolute h-full w-full "></div>
            <div className="text-white font-black text-3xl">
              Guru Accounting NY Account
            </div>
            <div className="h-[180px] w-[180px] absolute -bottom-16 left-6 bg-red-100 rounded-md">
              {/* <Image src="/white-logo.svg" alt="logo" width={100} height={100} /> */}
              <div className="flex items-center justify-center h-full w-full bg-[#95a598] rounded-sm font-bold text-2xl text-white text-center">Guru Accounting
              </div>
              {/* <span>AAc</span> */}

            </div>
          </div>
          <div className="h-[100px] bg-gray-50">
          </div>

          {/* CONTENT WRAPPER (keeps both halves fixed height, scroll inside only) */}
          <div className="flex flex-col h-full overflow-hidden p-4">
            <div>
              <h2 className="font-bold text-2xl p-2">Dashboard</h2>
            </div>
            {/* SERVICES (50%) */}
            {/* <div className="h-1/2 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <Link
                      href={service.redirect}
                      key={index}
                      className={`p-5 rounded-xl cursor-pointer hover:shadow-lg 
                                  transform hover:-translate-y-1 transition-all ${service.bgColor}`}
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-lg mb-3 bg-white">
                        <Icon className={`w-6 h-6 ${service.iconColor}`} />
                      </div>
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div> */}



          </div>
        </div>
        {/* <AiModel /> */}
        <div className="w-[25%] h-full p-4 bg-gray-50 backdrop-blur-xl flex flex-col">
          {/* show user demo list */}
          {/* {
            users.map((user, index) => (
              <div className="bg-white rounded-lg p-4 mb-4 flex gap-4 items-start"
                key={index}
              >
                <UserIcon className="w-6 h-6 text-black" />
                <div>
                  <div className="">
                    <div className="flex items-center justify-between mb-2">

                      <h4 className="font-semibold text-lg">{user.name}</h4>
                      <span className="text-sm text-gray-500">{user.date} - {user.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Email:</span> {user.email}</p>
                    <p className="text-sm text-gray-600"><span className="font-medium">Role:</span> {user.role}</p>
                  </div>
                </div>
              </div>
            ))
          } */}

        </div>

      </main>
    </div>
  );
}
