package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.BookTransactionHibernateDao;
import com.releevante.core.adapter.persistence.dao.TransactionItemStatusRecordHibernateDao;
import com.releevante.core.adapter.persistence.dao.TransactionStatusHibernateDao;
import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.repository.BookTransactionRepository;
import com.releevante.types.Slid;
import java.time.ZonedDateTime;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
public class BookTransactionRepositoryImpl implements BookTransactionRepository {
  private final BookTransactionHibernateDao bookLoanHibernateDao;

  private final TransactionItemStatusRecordHibernateDao loanItemStatusRecordHibernateDao;

  private final TransactionStatusHibernateDao loanStatusHibernateDao;

  public BookTransactionRepositoryImpl(
      BookTransactionHibernateDao bookLoanHibernateDao,
      TransactionItemStatusRecordHibernateDao loanItemStatusRecordHibernateDao,
      TransactionStatusHibernateDao loanStatusHibernateDao) {
    this.bookLoanHibernateDao = bookLoanHibernateDao;
    this.loanItemStatusRecordHibernateDao = loanItemStatusRecordHibernateDao;
    this.loanStatusHibernateDao = loanStatusHibernateDao;
  }

  @Override
  public Flux<BookLoan> findActiveLoans(Slid slid) {
    return null;
  }

  @Override
  public Flux<BookLoan> findCreatedInRange(ZonedDateTime start, ZonedDateTime end) {
    return null;
  }

  @Override
  public Flux<BookLoan> getByAllUnSynchronized() {
    return null;
  }
}
