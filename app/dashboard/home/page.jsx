"use client";

import { API_BASE_URL } from "@/app/constant/constant";
import AiModel from "@/components/customs/ai-model-components/AiModel";
import ProfileNav from "@/components/customs/profile/ProfileNav";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Briefcase, FileText, Shield, Users, DollarSign, Compass, UserIcon, Edit2, LogOut } from "lucide-react";
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


export default function HomePage() {
  const router = useRouter();
  const [status, setStatus] = useState("active"); // "active" or "offline"

const handleLogout = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // Sends cookies
    });

    if (!res.ok) {
      // If the response status is not 2xx, throw an error
      const errorData = await res.json();
      console.error("Logout failed:", errorData);
      alert(`Logout failed: ${errorData.message || "Unknown error"}`);
      return;
    }

    const data = await res.json();
    console.log("Logout success:", data);

    // Redirect only if logout was successful
    router.push("/login");
  } catch (err) {
    console.error("Logout failed:", err);
    alert(`Logout failed: ${err.message || "Server error"}`);
  }
};


  return (
    <div className="flex flex-col h-screen bg-gray-800 p-2">
       <div className=" rounded-tl-3xl rounded-tr-3xl bg-gray-100 px-4 pt-4 flex justify-between">
        <h1 className="text-3xl font-bold py-2 flex items-center justify-start">

            Wellcome to Dashboard</h1>
 <ProfileNav />

       </div>
      {/* MAIN */}
      <main className="flex flex-1 overflow-hidden">

        {/* LEFT PANEL */}
        <div className="flex-1 max-w-[70%] p-4 bg-gray-100 rounded-bl-3xl flex flex-col overflow-hidden">

   

          {/* CONTENT WRAPPER (keeps both halves fixed height, scroll inside only) */}
          <div className="flex flex-col h-full overflow-hidden">

            {/* SERVICES (50%) */}
            <div className="h-1/2 overflow-y-auto pr-1">
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
            </div>



          </div>
        </div>
        <AiModel />


      </main>
    </div>
  );
}
