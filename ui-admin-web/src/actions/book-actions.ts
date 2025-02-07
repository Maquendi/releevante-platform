'use server'
import { BookDetails, CategoryQuery, RecommendedBookResponse, VibeTag } from "@/types/book";

export async function FetchAllBooksByOrg() {
  const token=process.env.TOKEN
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/4e11b8d6-c797-4cd6-9d46-e484a79f0b66/books?asMap=true`,{
    method:'GET',
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`,  
    },
  })
  if (!res.ok) {
    console.error('Error al obtener categorías:', res.status, res.statusText);
    return [];
  }

  const data = await res.json()
  return  data?.context?.data || []
}

export async function FetchAllBookCategories():Promise<CategoryQuery> {
  const token=process.env.TOKEN
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/org/4e11b8d6-c797-4cd6-9d46-e484a79f0b66/categories`,{
    method:'GET',
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`,  
    },
  })
  if (!res.ok) {
    console.error('Error al obtener categorías:', res.status, res.statusText);
    return {} as any;
  }

  const data = await res.json()
  return  data?.context?.data || {}
}

export async function FetchBookById(bookId:string,translationId:string):Promise<BookDetails[]>{

  const token=process.env.TOKEN
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/${bookId}?translationId=${translationId}`,{
    method:'GET',
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`,  
    },
  })
  if (!res.ok) {
    console.error('Error al book by id:', res.status, res.statusText);
    return {} as any;
  }

  const data = await res.json()
  return  data?.context?.data || []
}


export async function FetchBooksByTag(tagValue:string):Promise<BookDetails[]>{

  const token=process.env.TOKEN
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/search?tagValue=${tagValue}`,{
    method:'GET',
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`,  
    },
  })
  if (!res.ok) {
    console.error('Error al book tags:', res.status, res.statusText);
    return {} as any;
  }

  const data = await res.json()
  return  data?.context?.data || []
}

export async function FetchVibeTags():Promise<VibeTag[]>{

  const token=process.env.TOKEN
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tags?name=flavor,vibe,mood`,{
    method:'GET',
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`,  
    },
  })
  if (!res.ok) {
    console.error('Error getting tags:', res.status, res.statusText);
    return {} as any;
  }

  const data = await res.json()
  return  data?.context?.data || []
}

export async function FetchRecomendationBook(searchParams:Record<string,any>):Promise<RecommendedBookResponse>{
  const preferencesValues = Object.values(searchParams)
  console.log("perefered values",preferencesValues)
  const token=process.env.TOKEN
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/books/recommendation?preferences=${preferencesValues}`,{
    method:'GET',
    headers: {
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`,  
    },
  })
  if (!res.ok) {
    console.error('Error getting tags:', res.status, res.statusText);
    return {} as any;
  }

  const data = await res.json()
  return  data?.context?.data || []
}