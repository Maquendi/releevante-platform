"use client";
import { Link } from "@/config/i18n/routing";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import React, { useRef } from "react";

export default function BookCategories({
  allCategories,
}: {
  allCategories: any[];
}) {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const currentCategoryId = searchParams?.get("categoryId");

  const ref = useRef<HTMLDivElement | null>(null);

  const scrollStep = 100;

  const scroll = () => {
    if (ref.current) {
      const container = ref.current;
      const isAtEnd =
        container.scrollLeft + container.clientWidth >= container.scrollWidth;

      if (!isAtEnd) {
        container.scrollTo({
          left: container.scrollLeft + scrollStep,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <div className="relative w-full">
      <button
        onClick={scroll}
        className="absolute bg-white -right-5 z-50 top-0 p-4 rounded-full shadow-xl"
      >
        <ChevronRight size={20} />
      </button>
      <div className="absolute right-2 top-0 z-[99] bottom-0 w-28 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>

      <div
        ref={ref}
        className="relative flex gap-2 items-center text-sm font-medium overflow-x-scroll no-scrollbar snap-x snap-mandatory select-none whitespace-nowrap"
      >

        <Link
          className={cn(
            "flex-none border px-6 py-3 border-gray-500 rounded-full snap-start",
            !currentCategoryId &&
              "bg-primary border-4 border-accent-foreground text-white"
          )}
          href={`/catalog`}
          scroll={false}
        >
          All
        </Link>
        {allCategories?.map((category) => (
          <Link
            className={cn(
              "flex-none border px-6 py-3 border-gray-500 rounded-full snap-start",
              currentCategoryId === category?.id &&
                "bg-primary border-4 border-accent-foreground text-white"
            )}
            href={`/catalog?categoryId=${category?.id}`}
            key={category?.id}
          >
            {category?.[`${locale}TagValue`] || ""}
          </Link>
        ))}

      </div>

    </div>
  );
}
