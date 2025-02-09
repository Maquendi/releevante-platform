package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.BookRatingRecord;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface BookRatingHibernateDao extends ReactiveCrudRepository<BookRatingRecord, String> {

  @Query(
      "with subquery as (\n"
          + "  with book_new_ratings as (\n"
          + "select\n"
          + "\t\tbr.isbn as book_id,\n"
          + "\t\tavg(br.rating) as rating,\n"
          + "\t\tcount(*) votes\n"
          + "from\n"
          + "\t\tcore.book_ratings br\n"
          + "group by\n"
          + "\t\tbr.isbn,\n"
          + "\t\tbr.is_synced\n"
          + "having\n"
          + "\t\tbr.is_synced = false\n"
          + ")\n"
          + "select\n"
          + "\t\tb.isbn as book_id,\n"
          + "\t\tcase\n"
          + "\t\t\twhen b.rating > 0\n"
          + "\t then (b.rating + bnr.rating)/ 2\n"
          + "\t\telse bnr.rating\n"
          + "\tend\n"
          + "\t as rating,\n"
          + "\t\t(b.votes + bnr.votes) as votes\n"
          + "from\n"
          + "\t\tcore.books b\n"
          + "join book_new_ratings bnr \n"
          + "on\n"
          + "\t\tbnr.book_id = b.isbn\n"
          + ")\n"
          + "update\n"
          + "\tcore.books\n"
          + "set\n"
          + "\trating = subquery.rating,\n"
          + "\tvotes = subquery.votes\n"
          + "from\n"
          + "\tsubquery\n"
          + "where\n"
          + "\tisbn = subquery.book_id;")
  Mono<Void> updateBookRatingUnSynced();
}
