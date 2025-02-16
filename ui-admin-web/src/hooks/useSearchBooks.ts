"use client";

import { FetchAllBooksByOrg } from "@/actions/book-actions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function normalizeString(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export default function useSearchBooks() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: books ={},isPending } = useQuery({
    queryKey: ["LIBRARY_INVENTORY"],
    queryFn: async () => FetchAllBooksByOrg(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
  });

  const booksArr=Object.values(books) || []

  

  const filteredBooks = booksArr?.filter((book: any) => {
    const normalizedTitle = normalizeString(book.title);
    const normalizedAuthor = normalizeString(book.author);
    const normalizedQuery = normalizeString(searchTerm);

    return (
      normalizedTitle.includes(normalizedQuery) ||
      normalizedAuthor.includes(normalizedQuery)
    );
  });

  const handleSetSearchTerm = (term: string) => {
    setSearchTerm(term);
  };

  return {
    searchTerm,
    isPending,
    books: filteredBooks,
    handleSetSearchTerm,
  };
}
