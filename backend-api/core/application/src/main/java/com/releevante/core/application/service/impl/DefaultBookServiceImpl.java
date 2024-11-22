package com.releevante.core.application.service.impl;

import com.releevante.core.application.dto.BookDto;
import com.releevante.core.application.dto.LibraryInventoryDto;
import com.releevante.core.application.service.BookRegistrationService;
import com.releevante.core.application.service.BookService;
import com.releevante.core.domain.Book;
import com.releevante.core.domain.BookCopyStatus;
import com.releevante.core.domain.LibraryInventory;
import com.releevante.core.domain.repository.BookRepository;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.Slid;
import com.releevante.types.UuidGenerator;
import com.releevante.types.ZonedDateTimeGenerator;
import java.time.ZonedDateTime;
import java.util.List;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

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
        .getBookInventory()
        .buffer(BATCH_SIZE)
        .flatMap(bookRepository::saveAll)
        .subscribeOn(Schedulers.boundedElastic())
        .then(Mono.just(uuidGenerator.next()));
  }

  @Override
  public Mono<String> executeLoadInventory(Slid slid, String source) {
    return bookRegistrationService
        .getLibraryInventory(source)
        .buffer(BATCH_SIZE)
        .flatMap(inventories -> buildInventory(inventories, slid))
        .buffer(BATCH_SIZE)
        .flatMap(bookRepository::saveInventory)
        .subscribeOn(Schedulers.boundedElastic())
        .then(Mono.just(uuidGenerator.next()));
  }

  Flux<LibraryInventory> buildInventory(List<LibraryInventoryDto> bookInventory, Slid slid) {
    return Flux.fromStream(bookInventory.stream())
        .flatMap(
            inventory -> {
              var createdAt = ZonedDateTimeGenerator.instance().next();
              return mapToInventory(inventory, slid, createdAt);
            });
  }

  Flux<LibraryInventory> mapToInventory(
      LibraryInventoryDto inventory, Slid slid, ZonedDateTime createdAt) {
    return Flux.range(0, inventory.qty())
        .map(
            index ->
                LibraryInventory.builder()
                    .isSync(false)
                    .id(uuidGenerator.next())
                    .isbn(inventory.bookId())
                    .status(BookCopyStatus.AVAILABLE)
                    .slid(slid.value())
                    .updatedAt(createdAt)
                    .createdAt(createdAt)
                    .build());
  }

  @Override
  public Mono<Book> saveBook(BookDto book) {
    return null;
  }
}
