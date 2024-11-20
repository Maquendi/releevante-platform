'use server'

import { bookServiceFacade } from "@/book/application"



export async function FetchAllBookCategory(){
    try {
        return await bookServiceFacade.findAllBookCategory()
    } catch (error) {
        throw new Error('Error fetching all books categories' +  error)
    }
}

export async function FetchAllBookBySearchCriteria(searchParam:string){
    try {
        return await bookServiceFacade.findAllBookBySearchCriteria(searchParam)
    } catch (error) {
        throw new Error('Error fetching books by seach criteria' +  error)
    }
}

export async function FetchAllBooks({limit}:{limit?:number}){
    try {
        return await bookServiceFacade.findAllBooks({limit:limit || 20})
    } catch (error) {
        throw new Error('Error fetching all books' +  error)
    }
}

export async function FetchBookById(isbn:string){
    try {
        return await bookServiceFacade.findBookById(isbn)
    } catch (error) {
        throw new Error('Error fetching book by id' +  error)
    }
}

export async function FetchAllBookByCategory(category:string){
    try {
        return await bookServiceFacade.findAllBookByCategory(category)
    } catch (error) {
        throw new Error('Error fetching books by category' +  error)
    }
}