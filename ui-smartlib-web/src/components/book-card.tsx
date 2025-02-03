'use server'

import Image from "next/image";

export default async function BookCard({ bookId }) {
  const imageUrl = `/api/images/books/${bookId}/100_anos_soledad.jpg`;
  return (
    <div>
      <Image src={imageUrl} width={200} height={200} alt="Book image" />;
    </div>
  );
}
