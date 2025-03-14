import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface MaxWithWrapperProps{
    children:ReactNode,
    className?:string
}

export default function MaxWithWrapper({children,className}:MaxWithWrapperProps) {
  return (
    <div className={cn('max-w-[1176px] m-auto px-4  md:px-6',className)}>
        {children}
    </div>
  )
}
