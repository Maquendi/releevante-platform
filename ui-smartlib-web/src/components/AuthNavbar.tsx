"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { usePathname, useRouter } from "@/config/i18n/routing";
import { useLocale, useTranslations } from "next-intl";

const NAVBAR_ITEMS=[
  {label:'English',value:'en',iconSrc:'/icons/us-flag.svg'},
  {label:'Spanish',value:'es',iconSrc:'/icons/spain-flag.svg'},
  {label:'French',value:'fr',iconSrc:'/icons/france-flag.svg'}
]

const AuthNavbar = () => {
  const router = useRouter();
  const path = usePathname();
  const t = useTranslations("wristbandScanAuth");
  const locale = useLocale();




  return (
    <nav className="w-full flex justify-between items-center px-8 mt-2 ">
      <Select
        defaultValue={locale}
        onValueChange={(localeVal) =>
          router.replace(path, { locale: localeVal as any })
        }
      >
        <SelectTrigger className="w-[150px] py-6 rounded-3xl">
          <SelectValue placeholder="Languaje" />
        </SelectTrigger>
        <SelectContent>
          {NAVBAR_ITEMS.map(item=>(
                <SelectItem key={item.label} value={item.value}>
                <div className="flex items-center font-medium  gap-2.5  justify-between">
                  <img
                    className="w-[30px] h-[30px] object-contain"
                    src={item.iconSrc}
                  ></img>
                  <p >{item.label}</p>{" "}
                </div>
              </SelectItem>
          ))}
      
       
        </SelectContent>
      </Select>
      <div>
        <p className="font-light">{t("header")}</p>
      </div>
    </nav>
  );
};

export default AuthNavbar;
