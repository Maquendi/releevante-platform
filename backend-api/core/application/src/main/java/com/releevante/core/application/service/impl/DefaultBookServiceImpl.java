package com.releevante.core.application.service.impl;

import com.releevante.core.application.dto.BookDto;
import com.releevante.core.application.service.BookRegistrationService;
import com.releevante.core.application.service.BookService;
import com.releevante.core.domain.Book;
import com.releevante.core.domain.repository.BookRepository;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.UuidGenerator;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class DefaultBookServiceImpl implements BookService {
  private final BookRepository bookRepository;
  private final BookRegistrationService bookRegistrationService;
  private final SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();
  private static final int BATCH_SIZE = 100;

  public DefaultBookServiceImpl(
      BookRepository bookRepository, BookRegistrationService bookRegistrationService) {
    this.bookRegistrationService = bookRegistrationService;
    this.bookRepository = bookRepository;
  }

  @Override
  public Mono<String> executeLoadBooks() {
    return bookRegistrationService
        .getBooks()
        .buffer(BATCH_SIZE)
        .flatMap(this::saveBooks)
        // .subscribeOn(Schedulers.boundedElastic())
        .then(Mono.just(uuidGenerator.next()));
  }

  @Override
  public Mono<Book> saveBook(BookDto book) {
    return null;
  }

  public Flux<Book> saveBooks(List<Book> books) {
    return bookRepository.save(books);
  }
}
