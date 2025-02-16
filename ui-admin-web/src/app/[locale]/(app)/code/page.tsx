"use client";
import BreadCrumbsPages from "@/components/BreadCrumbsPages";
import MaxWithWrapper from "@/components/MaxWithWrapper";
import Passcode from "@/components/Passcode";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/config/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";

const PAGES=[{
    path:'/catalog',
    label:'Home'
},
{
    path:'/cart',
    label:'MyCart'
},
{
    path:'/code',
    label:'Code',
    isCurrentPath:true
},
]
const SigninPasscode = ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) => {
  const t = useTranslations("AuthPasscodePage");

  return (
    <MaxWithWrapper className="md:max-w-[850px] mt-6 space-y-6">
      <div>
        <BreadCrumbsPages breadCrums={PAGES}/>
      </div>
      <section className="space-y-1 box-content py-3 md:p-5 bg-white w-full  rounded-xl   h-full m-auto">
        <div className="grid place-content-center">
          <Image
            src="/images/enter-pin.svg"
            width={300}
            height={300}
            className="w-[230px] h-[230px]"
            alt="enter pin image"
          />{" "}
        </div>
        <div className="grid place-content-center pt-2">
          <Passcode />
        </div>
        <div className="text-center space-y-2 md:space-y-3 pt-2 px-2">
          <h1 className="text-2xl md:text-4xl font-medium line ">{t("title")}</h1>
          <p className="text-[#827F7F]">{t("subTitle")}</p>
        </div>
        <div className="relative overflow-hidden grid place-content-center gap-5 tracking-wider p-3">
        <Link
          className={cn(
            buttonVariants({ variant: "outline" }),
            "z-50 border-primary bg-transparent  py-5 px-5 m-auto text-primary font-medium rounded-3xl tracking-wide"
          )}
          href={{
            pathname: "/auth",
            query: searchParams,
          }}
        >
          {t("footerBtn")}
        </Link>
      </div>
      </section>
     
    </MaxWithWrapper>
  );
};

export default SigninPasscode;
