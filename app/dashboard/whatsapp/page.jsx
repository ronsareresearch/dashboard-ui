"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
  HomeIcon,
  Mail,
  MessageSquare,
  Calendar,
  Square,
  Settings,
  Menu,
  X,
} from "lucide-react";

import WhatsAppUi from "@/app/components/WhatsAppUi";
import { API_BASE_URL } from "@/app/constant/constant";

// ========================================
// DASHBOARD COMPONENT
// ========================================
export default function Dashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // -----------------------------
  // LOGOUT FUNCTION
  // -----------------------------
  const handleLogout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


  return (
    <div className="flex h-screen bg-gray-50 relative overflow-hidden">

      {/* Mobile Hamburger */}
      <button
        className="lg:hidden absolute top-4 left-4 z-50 text-gray-800"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:static top-0 left-0 h-full w-[260px] 
          bg-gray-900 text-white overflow-y-auto transform transition-transform duration-300 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold">
            Guru Accounting<span className="text-blue-400 ml-2">AI</span>
          </h1>
        </div>

        <nav className="mt-8">

          {/* MAIN */}
          <div className="px-6 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/90 mb-4">
              MAIN
            </p>

            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2 text-blue-500 border-l-2 border-blue-500"
            >
              <HomeIcon size={16} className="text-blue-500" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* WEB APPS */}
          <div className="px-6 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/90 mb-4">
              WEB APPS
            </p>

            <Link
              href="/dashboard/whatsapp"
              className="flex items-center gap-3 px-4 py-2 hover:text-white text-gray-400"
            >
              <Mail size={18} />
              <span>WhatsApp</span>
            </Link>

            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 hover:text-white text-gray-400"
            >
              <Mail size={18} />
              <span>Email</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 hover:text-white text-gray-400"
            >
              <MessageSquare size={18} />
              <span>Chat</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 hover:text-white text-gray-400"
            >
              <Calendar size={18} />
              <span>Calendar</span>
            </a>
          </div>

          {/* COMPONENTS */}
          <div className="px-6 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/90 mb-4">
              COMPONENTS
            </p>

            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 hover:text-white text-gray-400"
            >
              <Square size={18} />
              <span>UI Kit</span>
            </a>

            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2 hover:text-white text-gray-400"
            >
              <Settings size={18} />
              <span>Advanced UI</span>
            </a>
          </div>
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="absolute bottom-6 left-0 w-full px-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-200"
          >
            <Settings size={18} className="text-red-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <WhatsAppUi />
      </div>
    </div>
  );
}
