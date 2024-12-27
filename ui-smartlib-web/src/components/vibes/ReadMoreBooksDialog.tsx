"use client";
import { Book } from "@/book/domain/models";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "@/config/i18n/routing";
import { useAddBookToCart } from "@/hooks/useAddBookToCart";
import { useTranslations } from "next-intl";

interface DialogReadMoreBooksDialogrops {
  book: Book;
}

export function DialogReadMoreBooksDialog({
  book,
}: DialogReadMoreBooksDialogrops) {
  const t = useTranslations("recommendationsPage");
  const router = useRouter();
  const {
    maxBookAllowed,
    booksInCartCount,
    handleAddToCart,
    selectedLanguage,
  } = useAddBookToCart();

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="py-7  px-8 rounded-full font-medium hover:text-black hover:bg-accent">
          <span className="first-letter:uppercase"> {t("rent")}</span>
        </Button>{" "}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader className="space-y-3 font-light mt-3">
          <DialogTitle className="text-xl font-medium tracking-wide">
            Do you want to read more books?
          </DialogTitle>
          <DialogDescription className="">
            You can take up to 4 book to read in the hotel or buy up to 4 book
            also.{" "}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-5">
      
          <Button
            variant="outline"
            onClick={()=>{
                handleAddToCart("RENT", book);
                router.push('/home')
            }}
            className="py-6 border-primary text-primary  px-6 rounded-full font-medium hover:text-black hover:bg-accent"
          >
            <span className="first-letter:uppercase tracking-wide">
              Yes, I want to read more
            </span>
          </Button>{" "}
          <Button
            disabled={
              !selectedLanguage ||
              booksInCartCount.rentItemsCount >= maxBookAllowed!
            }
            onClick={() => {
              handleAddToCart("RENT", book);
              router.push("/reviewcart");
            }}
            className="py-6   px-6 rounded-full font-medium hover:text-black hover:bg-accent"
          >
            <span className="first-letter:uppercase tracking-wide">No, just this one</span>
          </Button>{" "}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
