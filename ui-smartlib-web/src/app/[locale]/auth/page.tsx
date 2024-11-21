import AuthNavbar from "@/components/AuthNavbar";
import {  buttonVariants } from "@/components/ui/button";
import VideoPlayer from "@/components/videoPlayer";
import { Link } from "@/config/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
const Signin = () => {
  const t = useTranslations("wristbandScanAuth");

  return (
    <div className="grid grid-rows-[auto_1fr_auto]   min-h-screen overflow-hidden">
      <AuthNavbar />
      <section className="space-y-3 pb-4 border-l border-gray-300 w-[90vw] h-full m-auto">
        <figure className="">
          <Image
            priority
            className="object-contain m-auto w-[280px] h-auto"
            src="/images/releevante.svg"
            alt="relevant title image"
            width={300}
            height={300}
          />
        </figure>
        <div className="grid place-content-center">
          <VideoPlayer  src="/videos/wristband-qrcode.mp4" />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-medium line ">{t("title")}</h1>
          <p className="text-[#827F7F]">{t("subTitle")}</p>
        </div>
      </section>
      <div className="relative overflow-hidden grid place-content-center gap-5 tracking-wider  border-t border-gray-300 p-7">
      <p className="text-[#827F7F]">{t("footerText")}</p>

        <Link
          className={cn(buttonVariants({variant:'outline'}),"z-50 border-primary  py-5 px-5 m-auto text-primary font-medium rounded-3xl tracking-wide")}
          href={'/auth/passcode'}
        >
         {t("footerBtn")}
        </Link>

      </div>
    </div>
  );
};

export default Signin;
