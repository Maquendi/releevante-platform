package com.releevante.core.application.service;

import com.releevante.core.domain.Book;
import reactor.core.publisher.Flux;

public interface BookRegistrationService {
  Flux<Book> getBooks();
}
