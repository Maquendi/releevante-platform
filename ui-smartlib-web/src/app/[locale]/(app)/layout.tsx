import Navbar from "@/components/Navbar";
import {
  SidebarProvider,
} from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import dynamic from 'next/dynamic'
const CartSidebar = dynamic(() => import("@/components/CartSidebar"), {
  ssr:false
})
 
export default function layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="relative w-[100vw] overflow-x-auto">
        <Navbar/>
        {children}
      </div>
      <CartSidebar />
    </SidebarProvider>
  );
}
