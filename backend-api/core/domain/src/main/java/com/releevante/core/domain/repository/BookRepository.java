package com.releevante.core.domain.repository;

import com.releevante.core.domain.Book;
import java.util.List;
import reactor.core.publisher.Flux;

public interface BookRepository {
  Flux<Book> save(List<Book> books);
}
