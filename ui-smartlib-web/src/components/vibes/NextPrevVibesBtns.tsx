'use client';

import { Link, usePathname } from "@/config/i18n/routing";
import { useAppSelector } from "@/redux/hooks";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

interface NextPrevVibesBtnsProps {
  nextPage: string;
  prevPage?: string;
}

export default function NextPrevVibesBtns({
  nextPage,
  prevPage,
}: NextPrevVibesBtnsProps) {
  const selectedStates = useAppSelector((state) => state.vide);
  const path = usePathname();
  const t = useTranslations("vibeBtns")
  const nextPageAndQuery = useMemo(() => {
    if (path.endsWith("flavorofstory")) {
      const lowerCaseStates = Object.fromEntries(
        Object.entries(selectedStates).map(([key, value]) => [
          key.toLowerCase(), 
          value,
        ])
      );

      const qs = new URLSearchParams(lowerCaseStates as any).toString();
      return `${nextPage}?${qs}`;
    }
    return nextPage;
  }, [nextPage, path, selectedStates]);

  return (
    <div className="flex justify-center h-fit items-center gap-4 border-t border-gray-200 py-3">
      {prevPage && (
        <Link
          className="px-6 py-3.5 rounded-full border border-primary text-primary font-medium text-sm"
          href={prevPage}
        >
         { t('previous')}
        </Link>
      )}

      <Link
        className="px-6 py-3.5 rounded-full border border-primary text-primary font-medium text-sm"
        href={nextPageAndQuery}
      >
        {path.endsWith("flavorofstory") ?   t('submit') : t('next')} 
      </Link>
    </div>
  );
}
