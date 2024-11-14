import { FetchAllBookCategory } from "@/actions/book-actions"
import Image from "next/image"
import Link from "next/link"
import SearchFilter from "./SearchFilter"

const LandingPage = async() => {

    const bookCategories= await FetchAllBookCategory()
  return (
    <div className="px-10 mt-6 space-y-8">
        <h2 className="text-2xl">Home</h2>
        <div>
            <SearchFilter/>
        </div>
        <div className="flex gap-5 flex-wrap justify-center" >
            {bookCategories.map(category=>(
               <Link key={category.id} href={`/en/bookstest/${category.id}`}>
                <article className="relative w-[300px] h-[300px]" >
                    <Image fill src={category.imageUrl} alt="image"></Image>
                </article>
                <p className="text-center">{category.name}</p>

               </Link>
            ))}
        </div>
        <div className="flex justify-center">
            <Link href={'/en/bookstest'} className="p-3 rounded-md bg-cyan-700">Ver todos</Link>
        </div>
    </div>
  )
}

export default LandingPage