import React from "react";
import ImageWithSkeleton from "../ImageWithSkeleton";
import Rating from "../Rating";
import { cn } from "@/lib/utils";
import { Link } from "@/config/i18n/routing";
import { useMediaQuery } from "react-responsive";

interface BookItemProps {
  book: any;
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
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' })
  const defaultHeight = isMobile ? 200  : 250
  return (
    <div
      className={cn(
        "flex-shrink-0 space-y-4 text-center snap-start ml-3 md:ml-0 ",
        className
      )}
      style={{ width: width ? `${width}px` : isMobile ? '100%':'30%'}}
    >
      <Link className="cursor-pointer" href={`/catalog/book/${book?.correlationId}`}>
        <ImageWithSkeleton
          src={book?.image || ''}
          alt={book?.bookTitle}
          width={width || 80}
          height={height || defaultHeight}
          className="w-full  object-cover rounded-lg"
        />
        <div className="flex flex-col  space-y-1">
          <div className="flex text-end text-nowrap text-secondary-foreground items-center gap-3">
            <Rating rating={parseInt(book?.rating) || 0} />
            <p className="text-xs md:text-sm">{book?.rating || 0}</p>
            <p className="text-xs md:text-sm">({book?.votes || 0} votes)</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
