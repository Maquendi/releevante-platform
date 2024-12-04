"use client";

import { BookLanguage } from "@/book/domain/models";
import { cn } from "@/lib/utils";
import { setLanguage } from "@/redux/features/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { CircleCheck } from "lucide-react";
import { useMemo } from "react";

interface SelectLanguageProp {
  booklanguages: BookLanguage[];
}

export default function SelectLanguage({ booklanguages }: SelectLanguageProp) {
  const dispath = useAppDispatch();
  const selectedLanguage = useAppSelector((state) => state.cart.language);

  const sortedBookLanguages = useMemo(() => {
    return [...booklanguages].sort((a, b) => {
      if (a.language === "English") return -1; 
      if (b.language === "English") return 1;  
      if (a.language === "Spanish") return -1; 
      if (b.language === "Spanish") return 1;
      return 0; 
    });
  }, [booklanguages]);

  return (
    <div className="flex gap-4 items-center">
      {sortedBookLanguages.map(({ bookId, language }) => (
        <button
          className={cn(
            "font-medium flex gap-2 items-center px-5 py-4 rounded-full border border-secondary",
            language === selectedLanguage && "bg-black text-white"
          )}
          key={bookId}
          onClick={() => dispath(setLanguage({ language: language as any }))}
        >
          {selectedLanguage === language && (
            <CircleCheck className="h-4 w-4 fill-white text-black" />
          )}
          {language}
        </button>
      ))}
    </div>
  );
}
