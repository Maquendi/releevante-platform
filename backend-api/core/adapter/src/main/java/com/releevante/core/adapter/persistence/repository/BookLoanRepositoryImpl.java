package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.BookLoanHibernateDao;
import com.releevante.core.adapter.persistence.dao.LoanItemStatusRecordHibernateDao;
import com.releevante.core.adapter.persistence.dao.LoanStatusHibernateDao;
import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.repository.BookLoanRepository;
import com.releevante.types.Slid;
import java.time.ZonedDateTime;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
public class BookLoanRepositoryImpl implements BookLoanRepository {
  private final BookLoanHibernateDao bookLoanHibernateDao;

  private final LoanItemStatusRecordHibernateDao loanItemStatusRecordHibernateDao;

  private final LoanStatusHibernateDao loanStatusHibernateDao;

  public BookLoanRepositoryImpl(
      BookLoanHibernateDao bookLoanHibernateDao,
      LoanItemStatusRecordHibernateDao loanItemStatusRecordHibernateDao,
      LoanStatusHibernateDao loanStatusHibernateDao) {
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

  // @Override
  //  public Mono<Long> addLoanStatuses(List<LoanStatus> statuses) {
  //    return loanStatusHibernateDao
  //        .saveAll(LoanStatusRecord.many(statuses))
  //        .then(Mono.just((long) statuses.size()));
  //  }

  // @Override
  //  public Mono<Long> addLoanItemStatuses(List<LoanItemStatus> loanItemStatuses) {
  //    return loanItemStatusRecordHibernateDao
  //        .saveAll(LoanItemStatusRecord.many(loanItemStatuses))
  //        .then(Mono.just((long) loanItemStatuses.size()));
  //  }
}
