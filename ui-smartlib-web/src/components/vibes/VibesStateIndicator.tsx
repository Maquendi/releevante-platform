"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const VIBES_PAGES = ["readingvibe", "mood", "flavorofstory", "recomendation"];


function VibesStateItem({ isStateActive }: { isStateActive: boolean | undefined }) {
  return (
    <div
      className={cn(
        "w-[50px] h-[4px] rounded-md bg-gray-300",
        isStateActive && "bg-primary"
      )}
    />
   
  );
}

export default function VibesStateIndicator() {
  const path = usePathname();
  return (
    <div className="flex gap-4 justify-center w-fit m-auto">
      {VIBES_PAGES.map((page) => (
        <VibesStateItem key={page} isStateActive={path?.endsWith(page)} />
      ))}
    </div>
  );
}
