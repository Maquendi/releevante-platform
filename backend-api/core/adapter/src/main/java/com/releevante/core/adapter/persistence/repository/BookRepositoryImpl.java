package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.*;
import com.releevante.core.adapter.persistence.dao.projections.BookCopyProjection;
import com.releevante.core.adapter.persistence.records.*;
import com.releevante.core.domain.*;
import com.releevante.core.domain.repository.BookRepository;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.Slid;
import com.releevante.types.UuidGenerator;
import com.releevante.types.ZonedDateTimeGenerator;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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
        .flatMapMany(
            ignored -> Flux.mergeSequential(persistBookImages(books), persistBookTags(books)))
        .thenMany(Flux.fromIterable(books));
  }

  @Override
  public Flux<Book> find(Slid slid, int page, int size, boolean synced) {
    return find(
        libraryInventoryHibernateDao.findAllCopies(slid.value(), synced, page * size, size), size);
  }

  @Override
  public Flux<Book> find(Slid slid, int page, int size) {
    return find(libraryInventoryHibernateDao.findAllCopies(slid.value(), page * size, size), size);
  }

  @Override
  public Flux<Book> find(int page, int size) {
    return bookHibernateDao.findPaginated(page * size, size).map(BookRecord::toDomain);
  }

  @Override
  public Flux<BookImage> getImages(Isbn isbn) {
    return bookImageHibernateDao
        .findAllByIsbnIn(Set.of(isbn.value()))
        .map(BookImageRecord::toDomain);
  }

  private Flux<BookImageRecord> persistBookImages(List<Book> books) {
    return Flux.fromStream(books.stream().map(Book::images).flatMap(List::stream))
        .map(BookImageRecord::from)
        .collectList()
        .flatMapMany(bookImageHibernateDao::saveAll);
  }

  private Flux<BookTagRecord> persistBookTags(List<Book> books) {
    return Flux.fromStream(books.stream())
        .flatMap(book -> Flux.fromIterable(book.tags()).flatMap(this::getTag).map(toBookTag(book)))
        .collectList()
        .flatMapMany(bookTagHibernateDao::saveAll);
  }

  private Mono<TagRecord> getTag(Tag tag) {
    return tagHibernateDao
        .findFirstByValueIgnoreCase(tag.value())
        .switchIfEmpty(Mono.defer(() -> tagHibernateDao.save(TagRecord.from(tag))));
  }

  private Flux<Book> find(Flux<BookCopyProjection> bookPublisher, int size) {
    return bookPublisher
        .groupBy(BookCopyProjection::getIsbn)
        .flatMap(
            flux ->
                flux.collectList()
                    .flatMap(
                        copies ->
                            Mono.just(copies.getFirst())
                                .map(
                                    first ->
                                        Book.builder()
                                            .isbn(Isbn.of(first.getIsbn()))
                                            .correlationId(first.getCorrelationId())
                                            .language(first.getLang())
                                            .qty(size)
                                            .author(first.getAuthor())
                                            .description(first.getDescription())
                                            .descriptionFr(first.getDescriptionFr())
                                            .descriptionSp(first.getDescriptionEs())
                                            .createdAt(first.getCreatedAt())
                                            .updatedAt(first.getUpdatedAt())
                                            .bindingType(
                                                Optional.ofNullable(first.getBindingType()))
                                            .publicIsbn(Optional.ofNullable(first.getPublicIsbn()))
                                            .publisher(first.getPublisher())
                                            .printLength(first.getPrintLength())
                                            .dimensions(first.getDimensions())
                                            .publishDate(first.getPublishDate())
                                            .price(first.getPrice())
                                            .title(first.getTitle())
                                            .copies(
                                                copies.stream()
                                                    .map(
                                                        copy ->
                                                            BookCpy.builder()
                                                                .isbn(first.getIsbn())
                                                                .createdAt(first.getCreatedAt())
                                                                .updatedAt(first.getUpdatedAt())
                                                                .id(copy.getCpy())
                                                                .isSync(copy.isSync())
                                                                .status(
                                                                    BookCopyStatus.valueOf(
                                                                        copy.getStatus()))
                                                                .build())
                                                    .collect(Collectors.toList()))
                                            .build())));
  }

  private Function<TagRecord, BookTagRecord> toBookTag(Book book) {
    return tag -> BookTagRecord.from(uuidGenerator, dateTimeGenerator, book, tag);
  }

  @Transactional
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
