'use client'

import { useEffect } from "react"
import { handleUpdateImagedIndexDb } from "./helper"

const Sync = () => {

    useEffect(()=>{
        if(!window.navigator.onLine)return
        handleUpdateImagedIndexDb().then()
    },[])
  return (
    <></>
  )
}

export default Sync