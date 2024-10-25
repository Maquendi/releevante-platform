import { dbGetAll } from '@/lib/drizzle-client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Sync from './Sync'

const page =async () => {


  const books = await dbGetAll('books',{
    with:{
      images:true,
      copies:true
    }
  })

  
  return (
   <section className='mt-20 px-20'>
      <h2 className='text-4xl font-bold mb-10'>Books list</h2>
      <div className='relative grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 '>
      {books.map(book=>(
        <article key={book.id}>
          <Link href={`/en/bookstest/${book.id}`}>
          <div className='relative  w-[200px] h-[200px]'>
          <Image className='object-cover' fill src={book.images[0]?.url}  alt={book.name}></Image>
          </div>
          <p>{book.name}</p>
          <p>{book.author}</p>
          </Link>
        </article>
      ))}
    </div>
    <Sync/>
   </section>
  )
}

export default page