"use client";
import { usePathname, useRouter } from "@/config/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useLocale } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function SelectLanguage() {
  const NAVBAR_ITEMS = [
    { label: "English", value: "en", iconSrc: "/icons/us-flag.svg" },
    { label: "Spanish", value: "es", iconSrc: "/icons/spain-flag.svg" },
    { label: "French", value: "fr", iconSrc: "/icons/france-flag.svg" },
  ];
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();


  return (
    <>
      {!path.endsWith("/") ? (
        <div>
          <button
            className="flex cursor-pointer gap-5 justify-between  items-center custom:pl-3 custom:pr-7 z-50"
            onClick={()=>router.back()}
          >
            <Image
              src="/icons/arrow_left.svg"
              alt="arrow left icon"
              width={30}
              height={30}
              className="w-[30px] h-[30px] cursor-pointer"
            />
            <span className="font-medium z-40 cursor-pointer">Back</span>
          </button>
        </div>
      ) : (
        <Select
          defaultValue={locale}
          open={open}
          onOpenChange={setOpen}
          onValueChange={(localeVal) => {
            const currentPath = `${path}?${searchParams!.toString()!}`;
            router.replace(currentPath, { locale: localeVal as any });
          }}
        >
          <SelectTrigger
            className={cn(
              "w-[90px] custom:w-[150px] py-6 rounded-3xl",
              open && "bg-primary border-4 border-accent-foreground text-white"
            )}
          >
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {NAVBAR_ITEMS.map((item) => (
              <SelectItem key={item.label} value={item.value}>
                <div className="flex items-center font-medium gap-2.5 justify-between">
                  <img
                    className="w-[30px] h-[30px] object-contain"
                    src={item.iconSrc}
                    alt={`${item.label} flag`}
                  />
                  <p className="hidden custom:block">{item.label}</p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
}
