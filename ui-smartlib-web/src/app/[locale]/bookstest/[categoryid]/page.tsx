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
        <h2 className="text-2xl font-semibold">Books for  {categoryBooks[0].category}</h2>
      </div>
      <div className="bg-gray-100 rounded-md p-2 text-black">
        {categoryBooks.map(({subCategory,books}) => (
          <div key={subCategory} className="">
            <h4>{subCategory}</h4>
            <div>
              {books.map(book=>(
                     <Link
                     key={book?.isbn}
                     href={`/en/bookstest/${categoryId}/${book?.isbn}`}
                     className="p-3 rounded-xl text-center space-y-2 text-xl"
                   >
                     <figure>
                     <Image
                           width={300}
                           height={300}
                           src={book?.imageUrl}
                           alt="image"
                           className="m-auto w-[300px] object-cover h-[300px]"
                         />
                     </figure>
                     <h4>{book?.bookTitle}</h4>
                     <h4>{book?.author}</h4>
         
                   </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
