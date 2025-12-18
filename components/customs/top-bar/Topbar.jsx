"use client"

import SidebarTrigger from "@/components/ui/sidebar"
import { Bell } from "lucide-react"
import ProfileNav from "../profile/ProfileNav"

export default function TopBar() {
  return (
    <div
      className="
        h-[68px]
        flex items-center justify-between
        bg-[#657c6a]
        pr-4
        relative
        z-20
        pointer-events-auto
        border-l border-gray-400
      "
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-x-4 pl-4 ">
        <SidebarTrigger />
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        <Bell className="h-6 w-6 text-white cursor-pointer hover:text-black transition" />
        <ProfileNav />
      </div>
    </div>
  )
}
