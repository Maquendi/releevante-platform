import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type RegionType = "en-US" | "fr-FR" | "es-DO";

export function formatDateByRegion(date: Date, region: RegionType = "en-US") {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }

  const formattedDate = new Intl.DateTimeFormat(region, options as any).format(
    date
  );
  return formattedDate;
}