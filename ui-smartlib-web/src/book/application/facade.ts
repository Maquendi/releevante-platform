import { BookService } from "./services";

export class BookServiceFacade {
  constructor(private bookService: BookService) {}

  async searchAllCategories(): Promise<void> {}
}
