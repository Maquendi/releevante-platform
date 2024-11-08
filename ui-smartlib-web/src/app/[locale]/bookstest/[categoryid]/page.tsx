import { FetchAllBookByCategory } from "@/actions/book-actions";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const Page = async ({ params }:{params:any}) => {

  const categoryId=params.categoryid
  if(!categoryId)notFound()

  const categoryBooks = await FetchAllBookByCategory(categoryId)

  return (
    <div className="px-10 pt-10 space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Books for {categoryBooks.categoryName}</h2>
      </div>
      <div className=" grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
        {categoryBooks.books?.map((book) => (
          <Link
            key={book?.isbn}
            href={`/en/bookstest/${categoryId}/${book?.isbn}`}
            className="p-3 rounded-xl text-center space-y-2 text-xl"
          >
            <figure>
              {book?.images?.length && (
                <Image
                  width={300}
                  height={300}
                  src={book?.images[0]?.url}
                  alt="image"
                  className="m-auto w-[300px] object-cover h-[300px]"
                />
              )}
            </figure>
            <h4>{book?.bookTitle}</h4>
            <h4>{book?.editionTitle}</h4>

          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
