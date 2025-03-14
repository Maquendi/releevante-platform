import { clsx, type ClassValue } from "clsx";
import { cookies } from "next/headers";
import { twMerge } from "tailwind-merge";
import { extractPayload } from "./jwt-parser";
import { HashUtils } from "./hash-utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const createHashFromString = async (string) => {
  // const utf8 = new TextEncoder().encode(string);
  // const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
  // const hashArray = Array.from(new Uint8Array(hashBuffer));
  // const hashHex = hashArray
  //   .map((bytes) => bytes.toString(16).padStart(2, "0"))
  //   .join("");
  // return hashHex;

  return HashUtils.createSHAHash(string)
};

type RegionType = "en-US" | "fr-FR" | "es-DO";

export function formatDateByRegion(date: Date, region: RegionType = "en-US") {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat(region, options as any).format(
    date
  );
  return formattedDate;
}

export default function simpleStringToHash(value: string): string {
  return value.split("").reduce((hash, char) => {
    return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
  }, 0) as any;
}


export const arrayGroupinBy = function (xs: any[], key: string) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};