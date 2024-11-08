'use server'
import { DefaultBookServiceFacade } from "@/book/application/facade"



export async function FetchAllBookCategory(){
    try {
        return await DefaultBookServiceFacade.findAllBookCategory()
    } catch (error) {
        throw new Error('Error fetching all books categories' +  error)
    }
}

export async function FetchAllBookBySearchCriteria(searchParam:string){
    try {
        return await DefaultBookServiceFacade.findAllBookBySearchCriteria(searchParam)
    } catch (error) {
        throw new Error('Error fetching books by seach criteria' +  error)
    }
}

export async function FetchAllBooks(){
    try {
        return await DefaultBookServiceFacade.findAllBooks({limit:10})
    } catch (error) {
        throw new Error('Error fetching all books' +  error)
    }
}

export async function FetchBookById(isbn:string){
    try {
        return await DefaultBookServiceFacade.findBookById(isbn)
    } catch (error) {
        throw new Error('Error fetching book by id' +  error)
    }
}

export async function FetchAllBookByCategory(categoryId:string){
    try {
        return await DefaultBookServiceFacade.findAllBookByCategory(categoryId)
    } catch (error) {
        throw new Error('Error fetching books by category' +  error)
    }
}