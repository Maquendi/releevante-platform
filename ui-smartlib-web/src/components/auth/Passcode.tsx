"use client";

import React, { useState, useRef } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import VirtualKeyboard from "../VirtualKeyboard";
import { cn } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";

export default function Passcode() {
  const [input, setInput] = useState<string>("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
  const otpContainerRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(otpContainerRef, () => setIsKeyboardVisible(false));

  const { loginMutation, error, clearError } = useAuth();

  const handleInputChange = (val: string) => {
    if (error) clearError();
    setInput(() => val);
  };

  const handleClick = (event: React.MouseEvent) => {
    if (
      !isKeyboardVisible &&
      otpContainerRef.current &&
      otpContainerRef.current.contains(event.target as Node)
    ) {
      setIsKeyboardVisible(true);
    }
  };

  const handleAuthSubmit = async () => {
    setIsKeyboardVisible(false);
    await loginMutation.mutateAsync({ code: input });
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

      <VirtualKeyboard
        setInputText={setInput}
        open={isKeyboardVisible}
        setOpen={setIsKeyboardVisible}
        state={input}
        isNumeric={true}
      />
    </div>
  );
}
