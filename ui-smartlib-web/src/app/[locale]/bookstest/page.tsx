import { dbGetAll } from "@/lib/db/drizzle-client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = async () => {
  const booksList = await dbGetAll("bookSchema", {
    with: {
      images: true,
    },
  });


  return (
    <div className="px-10 pt-10 space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Book list</h2>
      </div>
      <div className=" grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
        {booksList?.map((book) => (
          <Link
            key={book?.id}
            href={`/en/bookstest/${book?.id}`}
            className="p-3 rounded-xl text-center space-y-2 text-xl"
          >
            <figure>
              {book?.images.length && (
                <Image
                  width={300}
                  height={300}
                  src={book?.images[0]?.url}
                  alt="image"
                  className="m-auto w-[300px] object-cover h-[300px]"
                />
              )}
            </figure>
            <h4>{book?.name}</h4>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
