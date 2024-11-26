"use client";

import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";

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
    <div suppressHydrationWarning className="relative" style={{minWidth:`${width}px`,minHeight:`${height}px`}}>
      {isLoading && <Skeleton className="absolute inset-0 bg-gray-100 w-full h-full" />}
      <Image
        src={src || "/images/reeleante.svg"}
        fill
        alt={alt}
        className={`${className} ${isLoading ? "w-full h-full opacity-0" : "opacity-100"} transition-opacity`}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
};

export default ImageWithSkeleton;
