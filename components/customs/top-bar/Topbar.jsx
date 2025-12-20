"use client"

import SidebarTrigger from "@/components/ui/sidebar"
import { Bell } from "lucide-react"
import ProfileNav from "../profile/ProfileNav"

export default function TopBar() {
  return (
    <div
      className="
        h-17
        flex items-center justify-between
        bg-prime
        pr-4
        relative
        z-20
        pointer-events-auto
        border-l border-gray-400
      "
    >
      {/* LEFT SECTION */}
      <div className="flex items-center gap-x-4 pl-4 ">
        {/* <div>
          <SidebarTrigger />
        </div> */}
        <div>

          <div className="pl-4 flex flex-row items-center gap-4">
            <div className="h-10 w-10 text-2xl rounded-full bg-prime-black text-white font-bold flex items-center justify-center">G</div>
            <div className="text-white text-2xl">Guru Accounting NY</div>
          </div>
        </div>
      </div>


      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">
        <Bell className="h-6 w-6 text-white cursor-pointer hover:text-prime-black transition" />
        <ProfileNav />
      </div>
    </div>
  )
}
