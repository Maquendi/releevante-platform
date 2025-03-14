'use client'

import { useTranslations } from "next-intl";
import Loading from "../Loading";
import { Button } from "../ui/button"

interface SaveChangesBannerProps{
    saveChanges:()=>void;
    resetChanges:()=>void;
    isLoading:boolean
}
export default function SaveChangesBanner({saveChanges,resetChanges,isLoading}:SaveChangesBannerProps) {
  const t = useTranslations('reservedBooks')
  return (
    <div className="bg-white/75 fixed bottom-0 right-0 left-0 py-4 flex justify-center">
        <div className="flex gap-2 m-auto">
            <Button disabled={isLoading} className="rounded-3xl px-6 hover:text-primary" onClick={saveChanges}>
              <p>{t('saveChangesBtn')}</p>
              {isLoading && <Loading/>}
            </Button>
            <Button variant="destructive" className="rounded-3xl px-6 hover:bg-red-400" onClick={resetChanges}>{t('resetBtn')}</Button>
        </div>
    </div>
  )
}
