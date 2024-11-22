package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.BookHibernateDao;
import com.releevante.core.adapter.persistence.dao.BookImageHibernateDao;
import com.releevante.core.adapter.persistence.dao.LibraryInventoryHibernateDao;
import com.releevante.core.adapter.persistence.records.BookImageRecord;
import com.releevante.core.adapter.persistence.records.BookRecord;
import com.releevante.core.adapter.persistence.records.LibraryInventoryRecord;
import com.releevante.core.domain.Book;
import com.releevante.core.domain.LibraryInventory;
import com.releevante.core.domain.repository.BookRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class BookRepositoryImpl implements BookRepository {
  final BookHibernateDao bookHibernateDao;
  final BookImageHibernateDao bookImageHibernateDao;
  final LibraryInventoryHibernateDao libraryInventoryHibernateDao;

  public BookRepositoryImpl(
      BookHibernateDao bookHibernateDao,
      BookImageHibernateDao bookImageHibernateDao,
      LibraryInventoryHibernateDao libraryInventoryHibernateDao) {
    this.bookHibernateDao = bookHibernateDao;
    this.bookImageHibernateDao = bookImageHibernateDao;
    this.libraryInventoryHibernateDao = libraryInventoryHibernateDao;
  }

  @Override
  public Flux<Book> saveAll(List<Book> books) {
    return Mono.just(books.stream().map(BookRecord::fromDomain).collect(Collectors.toList()))
        .flatMapMany(bookHibernateDao::saveAll)
        .collectList()
        .flatMapMany(
            ignored ->
                Flux.fromStream(books.stream().map(Book::images).flatMap(List::stream))
                    .map(BookImageRecord::from)
                    .collectList()
                    .flatMapMany(bookImageHibernateDao::saveAll))
        .thenMany(Flux.fromIterable(books));
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
