'use server'

import BookCard from "@/components/book-card";

export default async function BookDetails() {
  const bookId = "07fd3f2a-55ae-47f3-8f11-041ef6b2498f";
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>Books showing here</div>
      <BookCard bookId={bookId}/>
    </div>
  );
}