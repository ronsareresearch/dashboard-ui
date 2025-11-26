"use client"

import * as React from "react"
import { useSidebar } from "@/components/ui/sidebar"

export function Branding() {
  const { state } = useSidebar() // gives 'collapsed' or 'expanded'

  return (
    <div className={`flex items-center gap-2 ${state === "collapsed" ? "" : "justify-center px-4 py-3" } `}>
      {/* Logo or icon always visible */}
      <div className="flex p-2 h-6 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
        G
      </div>

      {/* Full text only when expanded */}
      <div
        className={`overflow-hidden transition-all duration-200 ${
          state === "collapsed" ? "w-0 opacity-0" : "w-auto opacity-100"
        }`}
      >
        <span className="text-xl font-bold text-white">
          Guru Accounting
        </span>
      </div>
    </div>
  )
}
