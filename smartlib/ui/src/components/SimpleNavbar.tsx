"use client";
import { useRouter } from "@/config/i18n/routing";
import useAuth from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

interface SimpleNavbarProps {
  intName: string;
  intValue: string;
  href: string;
}

export default function SimpleNavbar({
  intName,
  intValue,
  href,
}: SimpleNavbarProps) {
  const tReviewCart = useTranslations(intName);
  const router = useRouter();

  const { logoutMutation } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-white">
      <button onClick={() => logoutMutation.mutateAsync()}>
        <div className="flex gap-5 items-center">
          <ArrowLeft />
          <p className=" first-letter:uppercase font-medium">
            {tReviewCart(intValue)}
          </p>
        </div>
      </button>

      <div>
        <figure>
          <Image
            width={150}
            height={70}
            src="/images/releevante.svg"
            alt="Remove book from cart"
            className="w-[120px] h-auto rounded-md object-cover"
          />
        </figure>
      </div>
    </nav>
  );
}
