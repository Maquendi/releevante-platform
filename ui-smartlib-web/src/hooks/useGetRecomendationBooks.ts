"use client";

import {  useMemo } from "react";
import useGetAllBooks from "./useGetAllBooks";



export default function useGetRecomendationBooks({searchParams}:{searchParams:Record<string,string>}) {

  console.log("SearchParams -****************************************************");

  console.log(searchParams);
  
  const {books} = useGetAllBooks();

  const filteredBooks=useMemo(()=>{
    const tagsAgg = Object.values(searchParams)
    if(!books?.length)return
    return books?.map(book=>({
        tagsMatches:book.tags.filter(vibe=>tagsAgg.includes(vibe.id))?.length || 0,
        ...book,
    })).filter(book=>book.tagsMatches > 0)
    .sort((a, b) => b.tagsMatches - a.tagsMatches); 
  },[books,searchParams])

  const recomendedBook=useMemo(()=>{
    return filteredBooks?.length ? filteredBooks[0]:null
  },[filteredBooks])

  const remainingRecommendedBooks=useMemo(()=>{
    return filteredBooks?.slice(1,-1) || []
  },[filteredBooks])

  return {
    recomendedBook,
    remainingRecommendedBooks,
    allBooks:filteredBooks
  };
}
