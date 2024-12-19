import Image from "next/image";
import React from "react";

export default function MaintenancePage() {
  return (
    <div className="grid grid-rows-[auto_1fr] place-content-center gap-10 relative min-h-[80vh] overflow-hidden ">
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
      <section className="max-w-[500px]">
        <figure className="z-10">
          <Image
            width={200}
            height={200}
            className="object-contain m-auto"
            src="/images/team-building.svg"
            alt="team building  image"
            sizes="300px"
          />
        </figure>
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-semibold">We’re under maintenance right now</h2>
          <p className="text-secondary-foreground font-[400]"> If you need to return a book you can go to the receptionist at the hotel 
          or please come back later.</p>
        </div>
      </section>

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
