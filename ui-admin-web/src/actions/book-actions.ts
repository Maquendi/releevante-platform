'use server'
import { BookDetails, CategoryQuery, RecommendedBookResponse, VibeTag } from "@/types/book";
import mockBooks from '../config/mockapi/library_inventory.json'
import mockBooksCategories from '../config/mockapi/category_books.json'
import mockBooksDetailRepository from '../config/mockapi/books_by_id.json'
import mockTags from '../config/mockapi/vibe_tags.json'

export async function FetchAllBooksByOrg() {
  return  mockBooks?.context.data
}

export async function FetchAllBookCategories():Promise<CategoryQuery> {
  return  mockBooksCategories?.context?.data || {}
}

export async function FetchBookById(bookId:string,translationId:string):Promise<BookDetails[]>{
  const bookById:any = mockBooksDetailRepository.context.data.filter(book=>book.isbn === bookId || book.translationId === translationId)
  return  bookById as BookDetails[]
}


export async function FetchBooksByTag(tagValue:string):Promise<BookDetails[]>{

  const bestSellersBooks:any = mockBooksDetailRepository.context.data.filter(books=>{
    return books.tags.map(tag=>tag.value.en.toLocaleLowerCase() === tagValue.toLocaleLowerCase())
  })
  return  bestSellersBooks as BookDetails[]
}

export async function FetchVibeTags():Promise<VibeTag[]>{

  return  mockTags?.context?.data as VibeTag[]
}

export async function FetchRecomendationBook(searchParams:Record<string,any>):Promise<RecommendedBookResponse>{
  const preferencesValues = Object.values(searchParams)
  const machesRecomendations:any[] = mockBooksDetailRepository.context.data.map(book=>{
    const tagsCout = book.tags.filter(item=>preferencesValues.includes(item.id))
    return {
      ...book,
      count:tagsCout?.length
    }
  })
  .sort((a, b) => b.count - a.count)
  .filter(item=>item.count > 0)

  const firstBook = machesRecomendations?.[0]
  const recommended = mockBooksDetailRepository?.context.data.filter(item=>item.translationId === firstBook.translationId) as any[]
  const others = machesRecomendations.map(item=>({...item,image:item.images?.[0].url}))

  return  {recommended,others}
}


export async function SaveReservationBooks():Promise<VibeTag[]>{

  return  mockTags?.context?.data as VibeTag[]
}