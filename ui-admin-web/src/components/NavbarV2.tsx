'use client'
import { useRouter } from "@/config/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React from "react";

interface SimpleNavbarProps{
  prevRouteIntl:string
  middleNameInt?:string
  href?:string
}

export default function NavbarV2({prevRouteIntl,middleNameInt,href}:SimpleNavbarProps) {
  const tReviewCart = useTranslations("navbarMobile");
  const router = useRouter()

  const handlePrev=()=>{
    if(href){
        router.push(href)
        return
    }
    router.back()
  }

  return (
    <nav className="flex justify-between items-center px-6 py-1 bg-white border-b border-gray-200">
      <button onClick={handlePrev}>
        <div className="flex gap-5 items-center">
          <ArrowLeft />
          <p className=" first-letter:uppercase font-medium">
            {tReviewCart(prevRouteIntl)}
          </p>
        </div>
      </button>
      {
        middleNameInt && (
          <div>
          <p className="font-medium">{tReviewCart(middleNameInt)}</p>
        </div>
        )
      }
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
