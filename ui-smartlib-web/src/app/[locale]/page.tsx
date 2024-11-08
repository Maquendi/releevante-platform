import LandingPage from "@/components/LandingPage";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <div className=" min-h-screen p-8 pb-20 ">
      {/* <h1>{t("title")}</h1> */}
      <LandingPage/>
    </div>
  );
}
