package com.releevante.core.domain.repository;

import com.releevante.core.domain.Book;
import com.releevante.core.domain.LibraryInventory;
import java.util.List;
import reactor.core.publisher.Flux;

public interface BookRepository {
  Flux<Book> saveAll(List<Book> books);

  Flux<LibraryInventory> saveInventory(List<LibraryInventory> inventories);
}
