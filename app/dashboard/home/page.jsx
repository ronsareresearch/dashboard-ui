"use client";

import TopBar from "@/components/customs/top-bar/Topbar";
import { Briefcase, FileText, Shield, Users, DollarSign, Compass } from "lucide-react";


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

  // top to bottom nav devider 
  return (
    <div className="flex flex-col h-screen bg-gray-800">
      <TopBar />
      <main className="flex flex-1">

   <div className="flex-1 max-w-[75%] bg-white flex flex-col p-2">
  {/* Banner with background image rounded */}
  {/* <div className="h-50 relative flex justify-center items-center rounded">
    <img
      src="/background-img/banner4.jpg"
      alt="banner"
      className="absolute top-0 left-0 w-full h-full object-cover"
    />
    <div className="absolute right-4 bottom-4 font-thin text-white text-3xl text-center">
      Guru Accounting NY Account.
    </div>
    
    <div className="h-37.5 w-37.5 absolute -bottom-10 left-6 bg-prime rounded-full border-2 border-black z-10">
      <div className="flex items-center justify-center h-37.5 w-37.5 bg-prime rounded-full font-bold text-2xl z-10 text-white text-center">
      </div>
    </div>
   
  </div> */}

  {/* Inner content */}
  {/* <div className="flex flex-col h-full p-4">
    <div className="py-10 px-1">
      <h2 className="font-bold text-2xl p-2 text-prime-black">Dashboard</h2>
    </div>
  </div> */}
</div>

        <div className="w-[25%] h-full p-4 bg-gray-50 backdrop-blur-xl flex flex-col">
        </div>
      </main>
    </div>
  );
}
