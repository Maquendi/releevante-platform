package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.*;
import com.releevante.core.adapter.persistence.records.*;
import com.releevante.core.domain.Book;
import com.releevante.core.domain.LibraryInventory;
import com.releevante.core.domain.repository.BookRepository;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.UuidGenerator;
import com.releevante.types.ZonedDateTimeGenerator;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class BookRepositoryImpl implements BookRepository {
  final BookHibernateDao bookHibernateDao;
  final BookImageHibernateDao bookImageHibernateDao;
  final LibraryInventoryHibernateDao libraryInventoryHibernateDao;
  final BookTagHibernateDao bookTagHibernateDao;
  final TagHibernateDao tagHibernateDao;
  final SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();
  final SequentialGenerator<ZonedDateTime> dateTimeGenerator = ZonedDateTimeGenerator.instance();

  public BookRepositoryImpl(
      BookHibernateDao bookHibernateDao,
      BookImageHibernateDao bookImageHibernateDao,
      LibraryInventoryHibernateDao libraryInventoryHibernateDao,
      BookTagHibernateDao bookTagHibernateDao,
      TagHibernateDao tagHibernateDao) {
    this.bookHibernateDao = bookHibernateDao;
    this.bookImageHibernateDao = bookImageHibernateDao;
    this.libraryInventoryHibernateDao = libraryInventoryHibernateDao;
    this.bookTagHibernateDao = bookTagHibernateDao;
    this.tagHibernateDao = tagHibernateDao;
  }

  @Transactional
  @Override
  public Flux<Book> saveAll(List<Book> books) {
    return Mono.just(books.stream().map(BookRecord::fromDomain).collect(Collectors.toList()))
        .flatMapMany(bookHibernateDao::saveAll)
        .collectList()
        .flatMapMany(ignored -> Flux.zip(persistBookImages(books), persistBookTags(books)))
        .thenMany(Flux.fromIterable(books));
  }

  private Flux<BookImageRecord> persistBookImages(List<Book> books) {
    return Flux.fromStream(books.stream().map(Book::images).flatMap(List::stream))
        .map(BookImageRecord::from)
        .collectList()
        .flatMapMany(bookImageHibernateDao::saveAll);
  }

  private Flux<BookTagRecord> persistBookTags(List<Book> books) {
    return Flux.fromStream(books.stream())
        .flatMap(
            book -> {
              var tags = book.categoriesCombined();
              return Flux.fromStream(book.keyWords().stream())
                  .flatMap(this::getTag)
                  .map(toBookTag(book))
                  .collectList()
                  .flatMapMany(
                      bookTagRecords ->
                          tagHibernateDao
                              .findAllByValueIn(tags)
                              .map(toBookTag(book))
                              .collectList()
                              .map(validateCategoryTags(tags))
                              .flatMapMany(bookTags -> combine(bookTagRecords, bookTags)))
                  .collectList()
                  .flatMapMany(bookTagHibernateDao::saveAll);
            });
  }

  private Mono<TagRecord> getTag(String value) {
    return tagHibernateDao
        .findFirstByValueIgnoreCase(value)
        .switchIfEmpty(
            Mono.defer(
                () ->
                    tagHibernateDao.save(
                        TagRecord.fromKeyWord(uuidGenerator, dateTimeGenerator, value))));
  }

  Function<List<BookTagRecord>, List<BookTagRecord>> validateCategoryTags(List<String> tags) {
    return list -> {
      if (list.isEmpty()) {
        throw new RuntimeException("Failed to find tags");
      }

      if (tags.size() < list.size()) {
        throw new RuntimeException("Failed to find all category or subCategory tags");
      }

      return list;
    };
  }

  private Flux<BookTagRecord> combine(List<BookTagRecord> list1, List<BookTagRecord> list2) {
    return Flux.merge(Flux.fromIterable(list1), Flux.fromIterable(list2));
  }

  private Function<TagRecord, BookTagRecord> toBookTag(Book book) {
    return tag -> BookTagRecord.from(uuidGenerator, dateTimeGenerator, book, tag);
  }

  @Override
  public Flux<LibraryInventory> saveInventory(List<LibraryInventory> inventories) {
    return libraryInventoryHibernateDao
        .saveAll(
            inventories.stream()
                .map(LibraryInventoryRecord::fromDomain)
                .collect(Collectors.toList()))
        .thenMany(Flux.fromIterable(inventories));
  }
}
