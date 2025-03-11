"use client";

import React, { useState, useRef } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";


export default function Passcode() {
  const [input, setInput] = useState<string>("");
  const otpContainerRef = useRef<HTMLDivElement | null>(null);

  const { loginMutation, error,clearError } = useAuth();

  const handleInputChange = (val: string) => {
    if(error){
      clearError()
    }
    setInput(() => val);
  };


  const handleAuthSubmit = async () => {
    await loginMutation.mutateAsync({ code: input });
  };

  return (
    <div ref={otpContainerRef}  className="w-fit z-[99]">
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
                  "bg-white text-black py-[1.30rem] border otp-slot px-6 border-gray-500 rounded-md",
                  input[index] && 
                    "bg-[#FDF3E7]  border-black",
                    error && 'bg-[#FFE9F0] border-2 border-[#E60C51] text-[#E60C51]'
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

    </div>
  );
}
