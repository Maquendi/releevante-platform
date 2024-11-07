import { defaultBookRepository } from "../infrastructure/repositories-impl";
import { DefaultBookServiceImpl } from "./book-service-impl";
import { BookServiceFacadeImpl } from "./facade";

const bookService = new DefaultBookServiceImpl(defaultBookRepository);

export const defaultBookServiceFacade = new BookServiceFacadeImpl(bookService);
