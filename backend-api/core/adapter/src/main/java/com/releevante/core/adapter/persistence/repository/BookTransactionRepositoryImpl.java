package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.BookTransactionHibernateDao;
import com.releevante.core.adapter.persistence.dao.TransactionItemHibernateDao;
import com.releevante.core.adapter.persistence.dao.TransactionItemStatusRecordHibernateDao;
import com.releevante.core.adapter.persistence.dao.TransactionStatusHibernateDao;
import com.releevante.core.adapter.persistence.records.BookTransactionRecord;
import com.releevante.core.adapter.persistence.records.TransactionItemRecord;
import com.releevante.core.domain.BookLoan;
import com.releevante.core.domain.BookTransaction;
import com.releevante.core.domain.ClientId;
import com.releevante.core.domain.identity.model.OrgId;
import com.releevante.core.domain.repository.BookTransactionRepository;
import com.releevante.types.Slid;
import java.time.ZonedDateTime;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component
public class BookTransactionRepositoryImpl implements BookTransactionRepository {
  private final BookTransactionHibernateDao bookTransactionHibernateDao;

  private final TransactionItemHibernateDao bookTransactionItemHibernateDao;

  private final TransactionItemStatusRecordHibernateDao transactionItemStatusRecordHibernateDao;

  private final TransactionStatusHibernateDao transactionStatusHibernateDao;

  public BookTransactionRepositoryImpl(
      BookTransactionHibernateDao bookTransactionHibernateDao,
      TransactionItemHibernateDao bookTransactionItemHibernateDao,
      TransactionItemStatusRecordHibernateDao transactionItemStatusRecordHibernateDao,
      TransactionStatusHibernateDao transactionStatusHibernateDao) {
    this.bookTransactionHibernateDao = bookTransactionHibernateDao;
    this.bookTransactionItemHibernateDao = bookTransactionItemHibernateDao;
    this.transactionItemStatusRecordHibernateDao = transactionItemStatusRecordHibernateDao;
    this.transactionStatusHibernateDao = transactionStatusHibernateDao;
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

  @Override
  public Flux<BookTransaction> findAll() {
    return null;
  }

  @Override
  public Flux<BookTransaction> findAll(OrgId orgId) {
    return null;
  }

  @Override
  public Flux<BookTransaction> findByClientId(ClientId clientId) {
    return bookTransactionHibernateDao
        .findAllByClientId(clientId.value())
        .map(BookTransactionRecord::toDomain)
        .flatMap(
            transaction ->
                bookTransactionItemHibernateDao
                    .findAllByTransactionId(transaction.id().value())
                    .map(TransactionItemRecord::toDomain)
                    .collectList()
                    .map(transaction::withItems));
  }
}
