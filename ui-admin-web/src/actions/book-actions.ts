"use server";
import { executeGet,executePost, executePut } from "@/lib/htttp/http-client";
import { API_COOKIE } from "@/lib/htttp/utils";
import {
  Book,
  BookDetails,
  CategoryQuery,
  RecommendedBookResponse,
  ReservationBooksResponse,
  ReservationItem,
  VibeTag,
} from "@/types/book";
interface ServiceReview {
  comment?: string;
  rating: number;
}
interface BookReview {
  isbn?: string;
  rating: number;
}
export async function FetchAllBooksByOrg(): Promise<Book> {

  try {
    const res = await executeGet<Book>({
      resource: "/books",
      queryParams:{asMap:true}as any
    });

    return res.context.data;
   
  } catch (error) {
    throw new Error("Error getting books" + error);
  }
}

export async function FetchAllBookCategories(): Promise<CategoryQuery> {
 
  try {
    const res = await executeGet<CategoryQuery>({
      resource: "/books/categories",
    });
    return res.context.data;
  } catch (error) {
    throw new Error("Error getting categories" + error);
  }
}

export async function FetchBookById(
  isbn: string,
  translationId: string
): Promise<BookDetails[]> {
  try {
    const res = await executeGet<BookDetails[]>({
      resource: `/books/${isbn}`,
      queryParams: { isbn, translationId },
    });
    console.log('rest items',res?.context?.data )

    return res.context.data;
  } catch (error) {
    throw new Error("Error getting books" + error);
  }
}

export async function FetchBooksByTag(
  tagValue: string
): Promise<BookDetails[]> {
  try {
    const res = await executeGet<BookDetails[]>({
      resource: "/books/search",
      queryParams: { tagValue },
    });
    return res?.context?.data || [];
  } catch (error) {
    throw new Error("Error getting book by tags" + error);
  }
}

export async function FetchVibeTags(): Promise<VibeTag[]> {
  try {
    const res = await executeGet<VibeTag[]>({
      resource: "/tags",
      queryParams: { name: "flavor,vibe,mood" },
    });
    return res?.context?.data || [];
  } catch (error) {
    throw new Error("Error getting tags" + error);
  }
}

export async function FetchRecomendationBook(
  searchParams: Record<string, string>
): Promise<RecommendedBookResponse> {
  const preferences = Object.values(searchParams) as any

  try {
    const res = await executeGet<RecommendedBookResponse>({
      resource: "/books/recommendation",
      queryParams: { preferences },
    });
    return res?.context?.data || [];
  } catch (error) {
    throw new Error("Error getting recomendaiton books" + error);
  }
}

export async function SaveServiceReview(data: ServiceReview): Promise<void> {
  try {
     await executePost({ resource: "/service/review", body: data });
  } catch (error) {
    throw new Error("Error saving servide request" + error);
  }
}

export async function SaveBookReview(data: BookReview): Promise<void> {
  try {
     await executePost({ resource: "/book/review", body: data });
  } catch (error) {
    throw new Error("Error saving servide request" + error);
  }
}


export async function SaveReservationBooks(items: ReservationItem[]): Promise<void> {
  const clientId = API_COOKIE.CLIENT_ACCESS_ID();
  if(!clientId){
    throw new Error('UNAUTHORIZED')
  }
  try {
    await executePost({ resource: `/clients/${clientId}/reservations`, body: {clientId,items} })
  } catch (error) {
    throw new Error("Error saving servide request" + error);
  }
}

export async function SaveModifyReservations({items,reservationId}:{items:ReservationItem[],reservationId:string}): Promise<void> {
  const clientId = API_COOKIE.CLIENT_ACCESS_ID();
  if(!clientId){
    throw new Error('UNAUTHORIZED')
  }
  console.log('reservaitonID',reservationId);
  console.log('items',items)

  try {
    await executePut({ resource: `/clients/${clientId}/reservations/${reservationId}`, body: {items} })
  } catch (error) {
    throw new Error("Error saving servide request" + error);
  }
}

export async function FetchReservedBooks():Promise<ReservationBooksResponse[]> {
  const accessId = API_COOKIE.CLIENT_ACCESS_ID();
  
  if(!accessId){
    throw new Error('UNAUTHORIZED')
  }
  
  try {
    const data = await executeGet<ReservationBooksResponse[]>({ resource: `/clients/${accessId}/reservations`});
    return data?.context?.data 
  } catch (error) {
    throw new Error("Error saving servide request" + error);
  }
}