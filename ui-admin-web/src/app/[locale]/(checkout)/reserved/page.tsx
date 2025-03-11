'use server'
import MaxWithWrapper from "@/components/MaxWithWrapper";
import ReservedBooksContent from "@/components/reserved/ReservedBooksContent";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function ReservedBooksPage() {
    const t= await getTranslations('reservedBooks');
    
  return (
    <div className="pb-5">
      <header className=" bg-white py-5">
        <MaxWithWrapper className="grid grid-rows-[auto_auto] place-items-center md:flex flex-row-reverse md:justify-between items-center">
        <figure className="">
            <Image
              width={250}
              height={250}
              className="w-[150px] h-[150px]"
              src="/images/listening-music.svg"
              alt="reading book image"
            ></Image>
          </figure>
          <div className="space-y-1">
            <h1 className="text-center md:text-left text-2xl md:text-3xl font-semibold"><span>{t('reservedBooks1')}</span>  <span className="text-primary">{t('reservedBooks2')}</span> <span>{t('reservedBooks3')}</span></h1>
            <p className="font-light">
              {t('modifyReservation')}
            </p>
          </div>
    
        </MaxWithWrapper>
      </header>
      <ReservedBooksContent/>
    </div>
  );
}
