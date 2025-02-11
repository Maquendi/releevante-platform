"use client";
import { Link, useRouter } from "@/config/i18n/routing";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";
import { buttonVariants } from "../ui/button";
import Image from "next/image";
import MainSliderBooks from "../MainSliderBooks";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import useAuth from "@/hooks/useAuth";
import { fetchConfiguration } from "@/redux/features/settingsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useWebSocketServer } from "@/socket";

export default function RestHomePage() {
  const refSliderContainer = useRef(null);
  const refButtonsContainer = useRef(null);
  const dispatch = useAppDispatch();

  const { susbcribeOnServerEvents } = useWebSocketServer();

  const router = useRouter();
  const handleOutsideClick = () => {
    router.push("/selection");
  };

  useOnClickOutside(
    refSliderContainer,
    handleOutsideClick,
    refButtonsContainer
  );

  const { logoutMutation } = useAuth();
  useEffect(() => {
    susbcribeOnServerEvents(dispatch);
    dispatch(fetchConfiguration());
    logoutMutation.mutateAsync();
  }, []);

  return (
    <div className="relative min-h-[80vh] overflow-hidden">
      <div className="fixed -top-0 -right-48 h-[140px] w-full z-0">
        <figure className="relative w-full h-full">
          <Image
            fill
            src="/images/reelevante-initial-top.svg"
            className="z-0"
            alt="reelevante initial"
            sizes="w-[100vw]"
          />
        </figure>
      </div>
      <header>
        <figure className="relative w-[300px] h-[142px] m-auto">
          <Image
            fill
            className="object-contain"
            src="/images/releevante.svg"
            alt="relevant title image"
            sizes="300px"
          />
        </figure>
      </header>
      <div className="z-10" ref={refSliderContainer}>
        <MainSliderBooks />
      </div>
      <div
        className="flex gap-1 justify-center fixed bottom-8 left-[50%] -translate-x-[50%] z-50 "
        ref={refButtonsContainer}
      >
        <Link
          className={cn(
            buttonVariants(),
            "rounded-3xl font-medium text-xs hover:text-primary "
          )}
          href="/selection"
        >
          Search a book
        </Link>
        <Link
          className={cn(
            buttonVariants(),
            "rounded-3xl font-medium text-xs hover:text-primary "
          )}
          href="/returnbook"
        >
          Return a book
        </Link>
      </div>
      <div className="fixed -bottom-12 -left-16 h-[600px] w-full z-0">
        <figure className="relative w-full h-full">
          <Image
            fill
            src="/images/releevante-initial.svg"
            className="z-0"
            alt="reelevante initial"
            sizes="w-[100vw]"
          />
        </figure>
      </div>
    </div>
  );
}
