"use server";

import { bookServiceFacade } from "@/book/application";
import {
  BookByFtagsVibes,
  BookRecomendationParams,
  BookRecomendations,
  FtagsEnum,
  IBookDetail,
  LibraryInventory,
  Paging,
  PartialBook,
  SubCategory,
} from "@/book/domain/models";

export async function FetchAllBookCategories() {
  try {
    return await bookServiceFacade.findAllBookCategory();
  } catch (error) {
    throw new Error("Error fetching all books categories" + error);
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

export async function loadLibraryInventory(): Promise<LibraryInventory> {
  return await bookServiceFacade.loadLibraryInventory();
}

export async function loadBookDetail(
  translationId: string
): Promise<IBookDetail[]> {
  return await bookServiceFacade.findByTranslationId(translationId);
}

export async function loadBooksBySubcategory(
  enValue: string
): Promise<SubCategory> {
  return await bookServiceFacade.loadBooksBySubcategory(enValue);
}

export async function loadPartialBooksPaginated(
  paging?: Paging
): Promise<PartialBook[]> {
  return await bookServiceFacade.loadPartialBooksPaginated(paging);
}

export async function bookRecomendationsByTags(
  params: BookRecomendationParams
): Promise<BookRecomendations> {
  return await bookServiceFacade.bookRecomendationsByTags(params);
}
