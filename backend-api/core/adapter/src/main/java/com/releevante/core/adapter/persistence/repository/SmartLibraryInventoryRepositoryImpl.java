package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.BookTransactionHibernateDao;
import com.releevante.core.adapter.persistence.dao.LibraryInventoryHibernateDao;
import com.releevante.core.domain.BookCopyStatus;
import com.releevante.core.domain.TransactionItemStatusEnum;
import com.releevante.core.domain.repository.SmartLibraryInventoryRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class SmartLibraryInventoryRepositoryImpl implements SmartLibraryInventoryRepository {

  final LibraryInventoryHibernateDao libraryInventoryHibernateDao;

  final BookTransactionHibernateDao bookTransactionHibernateDao;

  public SmartLibraryInventoryRepositoryImpl(
      LibraryInventoryHibernateDao libraryInventoryHibernateDao,
      BookTransactionHibernateDao bookTransactionHibernateDao) {
    this.libraryInventoryHibernateDao = libraryInventoryHibernateDao;
    this.bookTransactionHibernateDao = bookTransactionHibernateDao;
  }

  @Override
  public Flux<Void> updateLibraryInventory() {
    return bookTransactionHibernateDao
        .findUnSynced()
        .flatMap(
            projection -> {
              if (TransactionItemStatusEnum.CHECK_IN_SUCCESS == projection.getStatus()) {
                return libraryInventoryHibernateDao.updateLibraryInventoryUsageCount(
                    projection.getCpy());
              }
              return libraryInventoryHibernateDao.updateInventoryStatusByCpy(
                  BookCopyStatus.from(projection.getStatus()).name(), projection.getCpy());
            });
  }

  @Override
  public Mono<Void> updateLibraryInventories() {
    return libraryInventoryHibernateDao.callUpdateLibraryInventoryStoredProcedure();
  }
}
