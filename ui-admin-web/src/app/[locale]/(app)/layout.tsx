import CartSidebar from "@/components/CartSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="relative w-[100vw] overflow-x-auto">
      <Navbar />
       <div>
        {children}
       </div>
      </div>
      <CartSidebar />
    </SidebarProvider>
  );
}
