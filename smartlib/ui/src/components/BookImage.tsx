"use client";

import simpleStringToHash from "@/lib/utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import useImagesIndexDb from "@/hooks/useImagesIndexDb";
export interface BookImageProp {
  url: string;
  className?: string;
  sizes: string;
  alt?: string;
}

export default function BookImage(props: BookImageProp) {
  const { url, className, sizes, alt } = props;
  const altProp = alt || `book-image`;
  const key = simpleStringToHash(url);

  console.log(`${key} === ${url}`)

  const [imageUrl, setImageUrl] = useState(url);

  const { getImageByBookId } = useImagesIndexDb();

  useEffect(() => {
    getImageByBookId({ id: key, image: url }).then((res) => setImageUrl(res));
  }, []);

  return (
    <Image
      className={className}
      sizes={sizes}
      fill
      src={imageUrl}
      alt={altProp}
    ></Image>
  );
}
