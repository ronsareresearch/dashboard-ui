"use client"

import * as React from "react"
import SidebarTrigger, { useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"

export function Branding() {
  const { state } = useSidebar()

  return (
    <div
      className="
        h-17 shrink-0
        bg-prime
        flex items-center
        pointer-events-none
      "
    >
      <div className="flex items-center justify-between w-full px-4">
        {/* 🔒 Logo: clickable */}
        <div className="h-10 w-30 shrink-0 flex items-center pointer-events-auto">
          <Image
            src="/kyte-logo-W.svg"
            alt="Logo"
            width={120}
            height={40}
            className="h-full w-auto object-contain"
            priority
          />
        </div>
                  <SidebarTrigger />

        {/* Text only when expanded */}
        {/* <div
          className={`ml-2 transition-all duration-200 pointer-events-none ${
            state === "collapsed"
              ? "w-0 opacity-0 overflow-hidden"
              : "w-auto opacity-100"
          }`}
        >
        </div> */}
      </div>
    </div>
  )
}
