package com.releevante.core.application.service;

import com.releevante.core.application.dto.BookDto;
import com.releevante.core.domain.Book;
import reactor.core.publisher.Mono;

public interface BookService {
  Mono<String> executeLoadBooks();

  Mono<Book> saveBook(BookDto book);
}
