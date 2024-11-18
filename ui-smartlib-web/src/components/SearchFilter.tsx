'use client'
import { FetchAllBookBySearchCriteria } from "@/actions/book-actions";
import { Book } from "@/book/domain/models";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useDebounce } from "use-debounce";
import VirtualKeyboard from "./VirtualKeyboard";

const SearchFilter = () => {
  const [queryTerm, setQueryTerm] = useState<string>("");
  const [results, setResults] = useState<Book[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null); 

  const [value] = useDebounce(queryTerm, 300);

  useEffect(() => {
    if (!value) return;
    setIsPending(true);
    setIsError(false);
    FetchAllBookBySearchCriteria(value)
      .then((data) => setResults(data))
      .catch(() => setIsError(true))
      .finally(() => setIsPending(false));
  }, [value]);

  const handleQueryTerm = (param: string) => {
    setQueryTerm(param);
  };

  const handleFocus = () => {
    setShowKeyboard(true);
  };

  const handleBlur = () => {
    setShowKeyboard(false); 
  };


  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar libros..."
        value={queryTerm}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => handleQueryTerm(e.target.value)}
        className="w-full text-slate-950 px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isPending && queryTerm ? (
        <div className="mt-2 text-gray-500">Cargando resultados...</div>
      ) : null}
      {isError && (
        <div className="mt-2 text-red-500">Error al cargar resultados.</div>
      )}
      {queryTerm && !isPending && !results.length ? (
        <div className="mt-2 text-red-500">Sin resultados encontrados.</div>
      ) : null}

      {results.length > 0 && queryTerm && (
        <div className="absolute text-black left-0 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto">
          {results.map((book) => (
            <Link key={book.isbn} href={`/en/bookstest/n/${book.isbn}`}>
              <article className="px-4 py-2 space-x-2 hover:bg-gray-100 cursor-pointer">
                <span> {book.bookTitle},</span>
                <span>{book.editionTitle}</span>
                <span className="text-xs">{book.publisher}</span>
              </article>
            </Link>
          ))}
        </div>
      )}

      <VirtualKeyboard
        handleInputChangeFn={handleQueryTerm}
        open={showKeyboard}
        state={queryTerm}
      />
    </div>
  );
};

export default SearchFilter;
