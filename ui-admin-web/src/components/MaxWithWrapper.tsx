import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface MaxWithWrapperProps{
    children:ReactNode,
    className?:string
}

export default function MaxWithWrapper({children,className}:MaxWithWrapperProps) {
  return (
    <div className={cn('max-w-[1176px] m-auto px-2  md:px-5',className)}>
        {children}
    </div>
  )
}
