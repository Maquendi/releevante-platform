"use server";

import { bookServiceFacade } from "@/book/application";
import { BookRatingDto } from "@/book/application/dto";
import {
  BookByFtagsVibes,
  BooksPagination,
  FtagsEnum,
  IBook,
  IBookDetail,
  LibraryInventory,
  SubCategoryGraph,
} from "@/book/domain/models";
import { extractPayload } from "@/lib/jwt-parser";
import { cookies } from "next/headers";

export async function FetchAllBookCategories() {
  try {
    return await bookServiceFacade.findAllBookCategory();
  } catch (error) {
    throw new Error("Error fetching all books categories" + error);
  }
}

export async function FetchAllBookBySearchCriteria(searchParam: string) {
  try {
    return await bookServiceFacade.findAllBookBySearchCriteria(searchParam);
  } catch (error) {
    throw new Error("Error fetching books by seach criteria" + error);
  }
}

export async function FetchAllBooks({ limit }: { limit?: number }) {
  try {
    return await bookServiceFacade.findAllBooks({ limit: limit || 20 });
  } catch (error) {
    throw new Error("Error fetching ftags " + error);
  }
}

export async function FetchBookById(isbn: string) {
  try {
    return await bookServiceFacade.findBookById(isbn);
  } catch (error) {
    throw new Error("Error fetching book by id" + error);
  }
}

export async function FetchAllBookByCategory() {
  try {
    return await bookServiceFacade.findAllBookByCategory();
  } catch (error) {
    throw new Error("Error fetching books by category" + error);
  }
}

export async function LoanLibraryInventory(pagination: BooksPagination) {
  try {
    return await bookServiceFacade.loanLibraryInventory();
  } catch (error) {
    throw new Error("Error to load library inventory" + error);
  }
}

export async function FetchFtagsBy(tagName: FtagsEnum) {
  try {
    return await bookServiceFacade.getFtagsByType(tagName);
  } catch (error) {
    throw new Error("Error fetching books by category" + error);
  }
}

export async function FetchBookByFtagsVibes(tagNames: BookByFtagsVibes) {
  try {
    return await bookServiceFacade.findBooksByVibeTags(tagNames);
  } catch (error) {
    throw new Error("Error fetching books by category" + error);
  }
}

export async function loadLibraryInventory(categoryId?:string): Promise<LibraryInventory> {
  return await bookServiceFacade.loadLibraryInventory(categoryId);
}

export async function loadBookDetail(
  translationId: string
): Promise<IBookDetail[]> {
  return await bookServiceFacade.findByTranslationId(translationId);
}

export async function loadBooksBySubcategory(
  enValue: string
): Promise<SubCategoryGraph> {
  return await bookServiceFacade.loadBooksBySubcategory(enValue);
}
