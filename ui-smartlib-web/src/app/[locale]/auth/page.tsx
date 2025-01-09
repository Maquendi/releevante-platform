import { buttonVariants } from "@/components/ui/button";
import VideoPlayer from "@/components/videoPlayer";
import { Link } from "@/config/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const Signin = ({searchParams}:{searchParams:Record<string,string>}) => {
  const t = useTranslations("wristbandScanAuth");

  return (
    <>
      <section className="space-y-3 pb-4 border-l border-gray-300 w-[90vw] h-full m-auto">
        <div className="grid place-content-center">
          <VideoPlayer src="/videos/wristband-qrcode.mp4" />
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-medium line ">{t("title")}</h1>
          <p className="text-[#827F7F]">{t("subTitle")}</p>
        </div>
      </section>
      <div className="relative overflow-hidden grid place-content-center gap-5 tracking-wider  border-t border-gray-300 p-7">
        <p className="text-[#827F7F]">{t("footerText")}</p>

        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "z-50 border-primary  py-5 px-5 m-auto text-primary font-medium rounded-3xl tracking-wide"
          )}
          href={{
            pathname:"/auth/passcode",
            query:searchParams
          }}
        >
          {t("footerBtn")}
        </Link>
      </div>
      </>
  );
};

export default Signin;
