"use client"

import * as React from "react"
import { useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"

export function Branding() {
  const { state } = useSidebar()

  return (
    <div
      className="
        h-[68px] shrink-0
        bg-[#657c6a]
        flex items-center
        pointer-events-none
      "
    >
      <div className="flex items-center w-full px-4">
        {/* 🔒 Logo: clickable */}
        <div className="h-10 w-[120px] shrink-0 flex items-center pointer-events-auto">
          <Image
            src="/logo-white.svg"
            alt="Logo"
            width={120}
            height={40}
            className="h-full w-auto object-contain"
            priority
          />
        </div>

        {/* Text only when expanded */}
        <div
          className={`ml-2 transition-all duration-200 pointer-events-none ${
            state === "collapsed"
              ? "w-0 opacity-0 overflow-hidden"
              : "w-auto opacity-100"
          }`}
        >
          {/* Optional text */}
        </div>
      </div>
    </div>
  )
}
