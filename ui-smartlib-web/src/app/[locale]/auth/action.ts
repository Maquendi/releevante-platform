'use server'

import { identityService } from "@/domain/identity/facade"


 export async function signinAction(formData:FormData) {
    try {
        const passcode = formData.get('passcode') as string

        identityService.doLogin(passcode)
        
    } catch (error:any) {
        throw new Error('Error signin in' + error)
    }
}