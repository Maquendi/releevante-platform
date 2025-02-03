package com.releevante.core.domain.repository;

import com.releevante.core.domain.*;
import com.releevante.types.Slid;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface BookRepository {
  Flux<Book> saveAll(List<Book> books);

  Flux<Book> find(Slid slid, int page, int size, boolean synced);

  Flux<Book> find(Slid slid, int page, int size);

  Flux<Book> find(int page, int size);

  Flux<BookImage> getImages(Isbn isbn);

  Flux<LibraryInventory> saveInventory(List<LibraryInventory> inventories);

  Flux<PartialBook> findAllBy(String orgId);

  Flux<Book> findAllBy(String isbn, String translationId);

  Flux<Book> getByTagIdList(List<String> tagIdList);

  Flux<Book> getByIsbnList(List<String> isbnList);

  Flux<Book> getByTagValues(List<String> tagValues);

  Mono<Book> findByIsbn(String isbn);
}
