package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.BookLoanHibernateDao;
import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.repository.BookLoanRepository;
import com.releevante.types.Slid;
import java.time.ZonedDateTime;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
public class BookLoanRepositoryImpl implements BookLoanRepository {
  private final BookLoanHibernateDao bookLoanHibernateDao;

  public BookLoanRepositoryImpl(BookLoanHibernateDao bookLoanHibernateDao) {
    this.bookLoanHibernateDao = bookLoanHibernateDao;
  }

  @Override
  public Flux<BookLoan> findActiveLoans(Slid slid) {
    return null;
  }

  @Override
  public Flux<BookLoan> findCreatedInRange(ZonedDateTime start, ZonedDateTime end) {
    return null;
  }
}
