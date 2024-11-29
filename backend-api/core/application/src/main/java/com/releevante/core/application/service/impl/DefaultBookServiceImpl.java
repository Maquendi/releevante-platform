package com.releevante.core.application.service.impl;

import com.releevante.core.application.dto.BookDto;
import com.releevante.core.application.dto.LibraryInventoryDto;
import com.releevante.core.application.dto.SyncStatus;
import com.releevante.core.application.dto.TagCreateDto;
import com.releevante.core.application.service.BookRegistrationService;
import com.releevante.core.application.service.BookService;
import com.releevante.core.domain.*;
import com.releevante.core.domain.repository.BookRepository;
import com.releevante.core.domain.repository.BookTagRepository;
import com.releevante.core.domain.repository.SmartLibraryRepository;
import com.releevante.core.domain.tags.TagTypes;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.Slid;
import com.releevante.types.UuidGenerator;
import com.releevante.types.ZonedDateTimeGenerator;
import com.releevante.types.exceptions.InvalidInputException;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

public class DefaultBookServiceImpl implements BookService {
  private final BookRepository bookRepository;
  private final BookRegistrationService bookRegistrationService;
  private final BookTagRepository bookTagRepository;
  private final SmartLibraryRepository smartLibraryRepository;
  private final SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();

  private final SequentialGenerator<ZonedDateTime> dateTimeGenerator =
      ZonedDateTimeGenerator.instance();
  private static final int BATCH_SIZE = 100;

  public DefaultBookServiceImpl(
      BookRepository bookRepository,
      BookRegistrationService bookRegistrationService,
      BookTagRepository bookTagRepository,
      SmartLibraryRepository smartLibraryRepository) {
    this.bookRegistrationService = bookRegistrationService;
    this.bookRepository = bookRepository;
    this.bookTagRepository = bookTagRepository;
    this.smartLibraryRepository = smartLibraryRepository;
  }

  @Override
  public Mono<Long> executeLoadBooks() {
    return bookRegistrationService
        .getBookInventory()
        .buffer(BATCH_SIZE)
        .flatMap(bookRepository::saveAll)
        .count()
        .subscribeOn(Schedulers.boundedElastic());
  }

  @Override
  public Mono<Long> executeLoadInventory(Slid slid, String source) {
    return smartLibraryRepository
        .findBy(slid)
        .map(
            smartLibrary -> {
              smartLibrary.validateIsActive();
              return smartLibrary;
            })
        .switchIfEmpty(Mono.error(new InvalidInputException("Smart library not exist")))
        .flatMap(
            smartLibrary ->
                bookRegistrationService
                    .getLibraryInventory(source)
                    .buffer(BATCH_SIZE)
                    .flatMap(inventories -> buildInventory(inventories, smartLibrary))
                    .buffer(BATCH_SIZE)
                    .flatMap(bookRepository::saveInventory)
                    .count());
  }

  @Override
  public Flux<Tag> createTags(TagCreateDto dto) {
    return bookTagRepository.create(dto.toDomain(uuidGenerator, dateTimeGenerator));
  }

  @Override
  public Flux<Book> getBooks(
      Slid slid,
      int page,
      int size,
      SyncStatus status,
      boolean includeImages,
      boolean includeTags) {

    if (Objects.isNull(status)) {
      return aggregateBooks(bookRepository.find(slid, page, size), includeImages, includeTags);
    }

    return aggregateBooks(
        bookRepository.find(slid, page, size, status.toBoolean()), includeImages, includeTags);
  }

  @Override
  public Flux<Book> getBooks(int page, int size, boolean includeImages, boolean includeTags) {
    return aggregateBooks(bookRepository.find(page, size), includeImages, includeTags);
  }

  @Override
  public Flux<Tag> getTags(TagTypes name) {
    return bookTagRepository.get(name);
  }

  @Override
  public Mono<Book> saveBook(BookDto book) {
    return null;
  }

  Flux<LibraryInventory> buildInventory(
      List<LibraryInventoryDto> bookInventory, SmartLibrary slid) {
    return Flux.fromStream(bookInventory.stream())
        .flatMap(
            inventory -> {
              var createdAt = ZonedDateTimeGenerator.instance().next();
              return mapToInventory(inventory, slid, createdAt);
            });
  }

  Flux<LibraryInventory> mapToInventory(
      LibraryInventoryDto inventory, SmartLibrary library, ZonedDateTime createdAt) {
    return Flux.range(0, inventory.qty())
        .map(
            index ->
                LibraryInventory.builder()
                    .isSync(false)
                    .id(uuidGenerator.next())
                    .isbn(inventory.bookId())
                    .status(BookCopyStatus.AVAILABLE)
                    .slid(library.id().value())
                    .updatedAt(createdAt)
                    .createdAt(createdAt)
                    .build());
  }

  private Flux<Book> aggregateBooks(
      Flux<Book> bookFlux, boolean includeImages, boolean includeTags) {
    return bookFlux.flatMap(
        book -> {
          var bookImagePublisher =
              Mono.just(includeImages)
                  .filter(Boolean::booleanValue)
                  .flatMap(ignored -> bookRepository.getImages(book.isbn()).collectList())
                  .defaultIfEmpty(Collections.emptyList());

          var bookTagPublisher =
              Mono.just(includeTags)
                  .filter(Boolean::booleanValue)
                  .flatMap(ignored -> bookTagRepository.getTags(book.isbn()).collectList())
                  .defaultIfEmpty(Collections.emptyList());

          return Mono.zip(bookImagePublisher, bookTagPublisher)
              .map(
                  data -> {
                    var images = data.getT1();
                    var tags = data.getT2();

                    var categories =
                        tags.stream()
                            .filter(tag -> tag.name().equals(TagTypes.category.name()))
                            .toList();

                    var subCategories =
                        tags.stream()
                            .filter(tag -> tag.name().equals(TagTypes.subcategory.name()))
                            .toList();

                    var keyWords =
                        tags.stream()
                            .filter(tag -> tag.name().equals(TagTypes.keyword.name()))
                            .toList();

                    return book.withCategories(categories)
                        .withSubCategories(subCategories)
                        .withKeyWords(keyWords)
                        .withImages(images);
                  });
        });
  }
}
