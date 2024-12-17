"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps {
  className?: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}

const ImageWithSkeleton = ({ src, width, height, alt, className }: ImageWithSkeletonProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div suppressHydrationWarning className="relative !bg-gray-200 rounded-md" style={{minWidth:`${width}px`,minHeight:`${height}px`}}>
      {isLoading && <Skeleton className="absolute inset-0 bg-gray-100 w-full h-full" />}
      <Image
        src={src || "/images/reeleante.svg"}
        fill
        alt={alt}
        sizes="w-full h-full"
        className={cn('transition-opacity',className,isLoading && "w-full h-full rounded-md object-contain object-top opacity-0 bg-gray-100")}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default ImageWithSkeleton;
