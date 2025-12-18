import TopBar from '@/components/customs/top-bar/Topbar'
import WhatsAppUi from '@/components/customs/whatsApp/WhatsAppUi'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-dropdown-menu'
import React from 'react'

const page = () => {
  return (
    <div>
     <TopBar />
      
      <WhatsAppUi />
    </div>
  )
}

export default page