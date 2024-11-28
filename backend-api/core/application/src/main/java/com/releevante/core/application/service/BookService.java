package com.releevante.core.application.service;

import com.releevante.core.application.dto.BookDto;
import com.releevante.core.domain.Book;
import com.releevante.types.Slid;
import reactor.core.publisher.Mono;

public interface BookService {
  Mono<Long> executeLoadBooks();

  Mono<String> executeLoadInventory(Slid slid, String source);

  Mono<Book> saveBook(BookDto book);
}
