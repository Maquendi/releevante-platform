import {  FetchAllBooks } from '@/actions/book-actions'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = async() => {
  const allBooks = await FetchAllBooks()

  return (
    <div className='px-10 mt-10 mb-5'>
      <h2 className='text-3xl'>All books</h2>
      <div>
      <div className=" grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2">
        {allBooks?.map((book) => (
          <Link
            key={book?.isbn}
            href={`/en/bookstest/n/${book?.isbn}`}
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
    </div>
  )
}

export default page