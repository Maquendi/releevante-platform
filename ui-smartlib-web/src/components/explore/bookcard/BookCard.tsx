import React from "react";
import ImageWithSkeleton from "../../ImageWithSkeleton";
import Rating from "../../Rating";
import { cn } from "@/lib/utils";
import { Link } from "@/config/i18n/routing";
import { PartialBook } from "@/book/domain/models";

interface BookCardProps {
  book: PartialBook;
  width?: number;
  height?: number;
  className?: string;
}

export default function BookCard({
  book,
  width,
  height,
  className,
}: BookCardProps) {
  return (
    <div
      className={cn(
        "flex-shrink-0 space-y-4 text-center snap-start",
        className
      )}
      style={{ width: width ? `${width}px` : "30%" }}
    >
      <Link className="cursor-pointer" href={`/explore/book/${book?.isbn}?lang=${book.translationId}`}>
        <ImageWithSkeleton
          src={book?.image || ""}
          alt={book?.title}
          width={width || 180}
          height={height || 250}
          className="w-full  object-cover rounded-lg"
        />
        <div className="flex flex-col  space-y-1">
          <div className="flex text-end text-nowrap text-secondary-foreground items-center gap-3">
            <Rating rating={book?.rating || 0} />
            <p>{book?.rating || 0}</p>
            <p>({book?.votes || 0} votes)</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
