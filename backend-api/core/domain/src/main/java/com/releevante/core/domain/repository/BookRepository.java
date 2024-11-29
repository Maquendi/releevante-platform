package com.releevante.core.domain.repository;

import com.releevante.core.domain.Book;
import com.releevante.core.domain.BookImage;
import com.releevante.core.domain.Isbn;
import com.releevante.core.domain.LibraryInventory;
import com.releevante.types.Slid;
import java.util.List;
import reactor.core.publisher.Flux;

public interface BookRepository {
  Flux<Book> saveAll(List<Book> books);

  Flux<Book> find(Slid slid, int page, int size, boolean synced);

  Flux<Book> find(Slid slid, int page, int size);

  Flux<Book> find(int page, int size);

  Flux<BookImage> getImages(Isbn isbn);

  Flux<LibraryInventory> saveInventory(List<LibraryInventory> inventories);
}
