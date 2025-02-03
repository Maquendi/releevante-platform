import { loadBookDetail } from "@/actions/book-actions";
import React from "react";
import { QueryClient } from "@tanstack/react-query";
import BookDetailComponent from "@/components/explore/bookdetail/BookDetailComponent";

export default async function Page(props) {
  const { params, searchParams } = props;
  const queryClient = new QueryClient();
  const translationId = searchParams["translationId"];
  const isbn = params?.id?.length ? params.id[0] : undefined;
  await queryClient.ensureQueryData({
    queryKey: ["BOOK_BY_TRANSLATION_ID", translationId],
    queryFn: () => loadBookDetail(translationId),
  });

  return <BookDetailComponent isbn={isbn} translationId={translationId} />;
}
