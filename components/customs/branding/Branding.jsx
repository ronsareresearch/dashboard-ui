"use client"

import * as React from "react"
import { useSidebar } from "@/components/ui/sidebar"
import Image from "next/image"



// BORDER COL : 202426
export function Branding() {
  const { state } = useSidebar() // gives 'collapsed' or 'expanded'

  return (
    <div className={`bg-[#657c6a] flex items-center gap-2 ${state === "collapsed" ? "" : "justify-start py-2" } `}>
      {/* Logo or icon always visible */}
  <div className="flex items-center justify-start font-bold py-1.5 pl-4 w-full">
  <div className="h-10">
    <Image
      src="/logo-white.svg"
      alt="Logo"
      width={100}
      height={100}
      className="h-full w-auto object-contain"
    />
  </div>
  <div className="ml-2">
    {/* <span className="text-white text-lg font-semibold">
      Guru Accounting
    </span> */}
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
