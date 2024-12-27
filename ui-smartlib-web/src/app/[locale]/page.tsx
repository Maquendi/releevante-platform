"use server";
import { FetchAllBooks } from "@/actions/book-actions";
import { FetchUserBooksLoan } from "@/actions/cart-actions";
import MainSliderBooks from "@/components/MainSliderBooks";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/config/i18n/routing";
import { cn } from "@/lib/utils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Image from "next/image";

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["ALL_BOOKS"],
    queryFn: () => FetchAllBooks({ limit: 25 }),
  });


  return (
    <div className="relative min-h-[80vh] overflow-hidden ">
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
      <div className="z-10">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <MainSliderBooks />
        </HydrationBoundary>
      </div>
      <div className="grid place-content-center fixed bottom-8 left-[50%] -translate-x-[50%] z-50">
        <Link
          className={cn(
            buttonVariants(),
            "rounded-3xl font-medium text-xs hover:text-primary "
          )}
          href={"/auth"}
        >
          Search a book
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
