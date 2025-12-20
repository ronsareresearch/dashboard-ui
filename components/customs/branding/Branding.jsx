"use client"

import * as React from "react"
import SidebarTrigger, { useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"

export function Branding() {
  const { state } = useSidebar()

  return (
    <div className="h-17 shrink-0 bg-prime flex items-center justify-between px-4 text-white">
      {/* Logo always visible */}
      <div className="h-10 w-30 flex items-center">
        <Image
          src="/kyte-logo-W.svg"
          alt="Logo"
          width={120}
          height={40}
          className="h-full w-auto object-contain"
          priority
        />
      </div>

  {state !== "collapsed" && (
  <SidebarTrigger className="pointer-events-auto z-50 text-white" />
)}

    </div>
  )
}
