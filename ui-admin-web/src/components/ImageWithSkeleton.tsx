"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "react-responsive";

interface ImageWithSkeletonProps {
  className?: string;
  src: string;
  width: number;
  height: number;
  alt: string;
}

const ImageWithSkeleton = ({ src, width, height, alt, className }: ImageWithSkeletonProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' })

  const styles={minWidth:isMobile ? 'auto':`${width}px`,minHeight:`${height}px`}
  return (
    <div suppressHydrationWarning className="relative !bg-gray-200 rounded-md" style={styles}>
      {isLoading && <Skeleton className=" !w-[100%] !h-[200px]" />}
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
