"use client"

import * as React from "react"
import { useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"

export function Branding() {
  const { state } = useSidebar() // gives 'collapsed' or 'expanded'

  return (
    <div className={`flex items-center gap-2 ${state === "collapsed" ? "" : "justify-start py-3" } `}>
      {/* Logo or icon always visible */}
  <div className="flex items-center justify-center font-bold">
  <div className="h-10">
    <Image
      src="/logo.png"
      alt="Logo"
      width={100}
      height={100}
      className="h-full w-auto object-contain"
    />
  </div>
</div>



      {/* Full text only when expanded */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          state === "collapsed" ? "w-0 opacity-0" : "w-auto opacity-100"
        }`}
      >
        <span className="text-xl font-bold text-white">
          {/* AI */}
          
        </span>
      </div>
    </div>
  )
}
