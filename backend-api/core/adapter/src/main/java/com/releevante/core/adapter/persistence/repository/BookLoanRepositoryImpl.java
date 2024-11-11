package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.BookLoanHibernateDao;
import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.repository.BookLoanRepository;
import com.releevante.core.domain.repository.CartRepository;
import com.releevante.types.Slid;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
public class BookLoanRepositoryImpl implements BookLoanRepository {
  private final CartRepository cartRepository;

  private final BookLoanHibernateDao bookLoanHibernateDao;

  public BookLoanRepositoryImpl(
      CartRepository cartRepository, BookLoanHibernateDao bookLoanHibernateDao) {
    this.cartRepository = cartRepository;
    this.bookLoanHibernateDao = bookLoanHibernateDao;
  }

  @Override
  public Flux<BookLoan> getActive(Slid slid) {
    return null;
  }
}
