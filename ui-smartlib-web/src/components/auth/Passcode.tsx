"use client";

import React, { useState, useRef } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import VirtualKeyboard from "../VirtualKeyboard";
import { useMutation } from "@tanstack/react-query";
import { authSignIn } from "@/actions/auth-actions";
import { useRouter } from "@/config/i18n/routing";
import { cn } from "@/lib/utils";

export default function Passcode() {  
  const [input, setInput] = useState<string>("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
  const otpContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();  
  const [error,setError]=useState<boolean>(false)
  useOnClickOutside(otpContainerRef, () => setIsKeyboardVisible(false));
  const { mutateAsync: authSigninAction } = useMutation({
    mutationFn: authSignIn,
    onSuccess() {
      router.push("/catalog");
    },
    onError() {
        setError(true)
    },
  });

  const handleInputChange = (val: string) => {
    if(error)setError(false)
    setInput(() => val)
  }

  const handleClick = (event: React.MouseEvent) => {
    if (
      !isKeyboardVisible &&
      otpContainerRef.current &&
      otpContainerRef.current.contains(event.target as Node)
    ) {
      setIsKeyboardVisible(true);
    }
  }

  const handleAuthSubmit = async () => {
    setIsKeyboardVisible(false);
    await authSigninAction(input);
  };

  return (
    <div ref={otpContainerRef} onClick={handleClick} className="w-fit z-[99]">
      <div>
        <InputOTP
          inputMode="numeric"
          onChange={handleInputChange}
          value={input}
          maxLength={4}
          onComplete={handleAuthSubmit}
        >
          <InputOTPGroup className="space-x-1">
            {[0, 1, 2, 3].map((index) => (
              <InputOTPSlot
                key={index}
                className={cn(
                  "bg-white  text-black py-[1.30rem] border otp-slot  px-6 border-gray-500 rounded-md",
                  error &&
                    input &&
                    "otp-slot border-x-2 border-y-2 text-[#E60C51] border-[#E60C51] bg-[#FFE9F0]"
                )}
                index={index}
                tabIndex={0}
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {error && (
          <p className="text-[#E60C51] font-normal mt-1 text-sm">
            Please enter a valid pin code.
          </p>
        )}
      </div>

      <VirtualKeyboard
        handleInputChangeFn={handleInputChange}
        open={isKeyboardVisible}
        setOpen={setIsKeyboardVisible}
        state={input}
        isNumeric={true}
      />
    </div>
  );
}
