import React from "react";
import BookDetailComponent from "@/components/explore/bookdetail/BookDetailComponent";

export default async function Page(props) {
  const { params, searchParams } = props;
  const translationId = searchParams["translationId"];
  const isbn = params?.id?.length ? params.id[0] : undefined;
  return <BookDetailComponent isbn={isbn} translationId={translationId} />;
}
