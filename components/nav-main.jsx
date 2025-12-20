"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain({ items, permissions }) {
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState({})

  useEffect(() => {
    const newOpenItems = {}
    items.forEach((item) => {
      if (item.title !== "home") {
        const isActive = item.items?.some((sub) => sub.url === pathname)
        if (isActive) newOpenItems[item.title] = true
      }
    })
    setOpenItems(newOpenItems)
  }, [pathname, items])

  const toggleItem = (title) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {/* Render "home" items directly if user has access */}
        {items
          .filter((item) => item.title === "home")
          .map((homeItem) =>
            Object.keys(homeItem.items).map((key) => {
              if (permissions?.home?.[key]) {
                const isActive = pathname === homeItem.items[key].url
                return (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton
                      asChild
                      className={isActive ? "text-white font-semibold" : ""}
                    >
                      <Link
                        href={homeItem.items[key].url}
                        className="block w-full px-2 py-1 rounded-md hover:text-white text-gray-400"
                      >
                        {key.replace(/_/g, " ")}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              }
              return null
            })
          )}

        {/* Render other items as collapsible */}
        {items
          .filter((item) => item.title !== "home")
          .map((item) => {
            const isChildActive = item.items?.some((sub) => sub.url === pathname)
            const isOpen = openItems[item.title] || isChildActive

            return (
              <Collapsible key={item.title} asChild open={isOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => toggleItem(item.title)}
                      className={
                        isChildActive
                          ? "text-white font-semibold"
                          : isOpen
                          ? "text-white"
                          : ""
                      }
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title.replace(/_/g, " ")}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isSubActive = subItem.url === pathname
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={subItem.url}
                                className={`block w-full px-2 py-1 rounded-md transition ${
                                  isSubActive
                                    ? "text-white font-bold underline"
                                    : "text-gray-400 hover:text-white"
                                }`}
                              >
                                {subItem.title.replace(/_/g, " ")}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
