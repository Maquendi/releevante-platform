import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-[100vw] overflow-x-auto">
      <Navbar cartTriggerType="PAGE" />
      <div>{children}</div>
    </div>
  );
}
