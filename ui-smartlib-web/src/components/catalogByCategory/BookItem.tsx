import React from "react";
import ImageWithSkeleton from "../ImageWithSkeleton";
import Rating from "../Rating";
import { cn } from "@/lib/utils";
import { Link } from "@/config/i18n/routing";
import { BookItems } from "@/book/domain/models";

interface BookItemProps {
  book: BookItems;
  width?: number;
  height?: number;
  className?: string;
}

export default function BookItem({
  book,
  width,
  height,
  className,
}: BookItemProps) {
  return (
    <div
      className={cn(
        "flex-shrink-0 space-y-4 text-center snap-start",
        className
      )}
      style={{ width: width ? `${width}px` : "30%" }}
    >
      <Link className="cursor-pointer" href={`/catalog/book/${book?.correlationId}`}>
        <ImageWithSkeleton
          src={book?.image || ''}
          alt={book?.bookTitle}
          width={width || 180}
          height={height || 250}
          className="w-full  object-cover rounded-lg"
        />
        <div className="flex flex-col  space-y-1">
          <div className="flex text-end text-nowrap text-secondary-foreground items-center gap-3">
            <Rating rating={parseInt(book?.rating)} />
            <p>{book?.rating}</p>
            <p>({book?.votes} votes)</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
