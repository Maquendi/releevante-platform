package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.BookHibernateDao;
import com.releevante.core.adapter.persistence.records.BookRecord;
import com.releevante.core.domain.Book;
import com.releevante.core.domain.repository.BookRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class BookRepositoryImpl implements BookRepository {

  final BookHibernateDao bookHibernateDao;

  public BookRepositoryImpl(BookHibernateDao bookHibernateDao) {
    this.bookHibernateDao = bookHibernateDao;
  }

  @Override
  public Flux<Book> save(List<Book> books) {
    return Mono.just(books.stream().map(BookRecord::fromDomain).collect(Collectors.toList()))
        .flatMapMany(bookHibernateDao::saveAll)
        .thenMany(Flux.fromIterable(books));
  }
}
