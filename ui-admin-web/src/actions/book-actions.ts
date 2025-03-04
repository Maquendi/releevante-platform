"use server";
import { executeGet,executePost } from "@/lib/htttp/http-client";
import {
  Book,
  BookDetails,
  CategoryQuery,
  RecommendedBookResponse,
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
     await executePost({ resource: "service/review", body: data });
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
