"use client";
import React from "react";

import { useTranslations } from "next-intl";
import SelectLanguage from "./SelectLanguage";



const AuthNavbar = () => {

  const t = useTranslations("wristbandScanAuth");
 

  return (
    <nav className="w-full flex justify-between items-center px-8 mt-2 ">
      <SelectLanguage/>
      <div>
        <p className="font-light">{t("header")}</p>
      </div>
    </nav>
  );
};

export default AuthNavbar;
