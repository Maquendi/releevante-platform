import React from "react";
import ImageWithSkeleton from "../ImageWithSkeleton";
import Rating from "../Rating";
import { CategoryBookItem } from "@/book/domain/models";
import { cn } from "@/lib/utils";

interface BookItemProps {
  book: CategoryBookItem;
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
      className={cn("flex-shrink-0 space-y-4 text-center snap-start", className)}
      style={{ width: width ? `${width}px` : "30%" }}
    >
      <ImageWithSkeleton
        src={book.imageUrl}
        alt={book.bookTitle}
        width={width || 180}
        height={height || 250}
        className="w-full  object-cover rounded-lg"
      />
      <div className="flex flex-col  space-y-1">
        <div className="flex text-end text-nowrap text-secondary-foreground items-center gap-3">
          <Rating rating={book.rating} />
          <p>{book.rating}</p>
          <p>({book.votes} votes)</p>
        </div>
      </div>
    </div>
  );
}
