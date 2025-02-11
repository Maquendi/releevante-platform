package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.BookRatingHibernateDao;
import com.releevante.core.domain.repository.ratings.BookRatingRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class BookRatingRepositoryImpl implements BookRatingRepository {

  final BookRatingHibernateDao bookRatingHibernateDao;

  public BookRatingRepositoryImpl(BookRatingHibernateDao bookRatingHibernateDao) {
    this.bookRatingHibernateDao = bookRatingHibernateDao;
  }

  @Override
  public Mono<Void> updateBookRatingUnSynced() {
    return bookRatingHibernateDao.callUpdateBookRatingsStoredProcedure();
  }
}
