import Image from 'next/image'
import React from 'react'

export default function loading() {
  return (
    <div className='grid place-content-center h-svh'>

        <div className='text-center'>
            <Image src='/images/image-books.gif' width={150} height={150} className='w-[150px] h-[150px] object-contain m-auto' alt='image loaidng books'/>
        </div>
    </div>
  )
}
