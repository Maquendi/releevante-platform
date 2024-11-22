"use client";

import React, { useState, useRef } from "react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import VirtualKeyboard from "../VirtualKeyboard";
import { useMutation } from "@tanstack/react-query";
import { authSignIn } from "@/actions/auth-actions";
import { useRouter } from "@/config/i18n/routing";

export default function Passcode() {
  const [input, setInput] = useState<string>("");
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);
  const otpContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  useOnClickOutside(otpContainerRef, () => setIsKeyboardVisible(false));
  const { mutateAsync: authSigninAction } = useMutation({
    mutationFn: authSignIn,
    onSuccess() {
      router.push("/catalog");
    },
    onError(err) {
      console.log("err auth", err);
    },
  });

  const handleInputChange = (val: string) => setInput(() => val);

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
    await authSigninAction(input);
  };

  return (
    <div ref={otpContainerRef} onClick={handleClick} className="w-fit">
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
              className="bg-white py-5 border px-6 border-gray-500 rounded-md"
              index={index}
              tabIndex={0}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

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
