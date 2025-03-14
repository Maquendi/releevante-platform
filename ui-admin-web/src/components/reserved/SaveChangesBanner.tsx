'use client'

import Loading from "../Loading";
import { Button } from "../ui/button"

interface SaveChangesBannerProps{
    saveChanges:()=>void;
    resetChanges:()=>void;
    isLoading:boolean
}
export default function SaveChangesBanner({saveChanges,resetChanges,isLoading}:SaveChangesBannerProps) {
  return (
    <div className="bg-white/75 fixed bottom-0 right-0 left-0 py-4 flex justify-center">
        <div className="flex gap-2 m-auto">
            <Button disabled={isLoading} className="rounded-3xl px-6" onClick={saveChanges}>
              <p>Guardar cambios</p>
              {isLoading && <Loading/>}
            </Button>
            <Button variant="destructive" className="rounded-3xl px-6" onClick={resetChanges}>Restablecer</Button>
        </div>
    </div>
  )
}
