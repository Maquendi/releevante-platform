package com.releevante.core.domain.repository.ratings;

import com.releevante.core.domain.BookRating;
import com.releevante.core.domain.Isbn;
import reactor.core.publisher.Mono;

public interface BookRatingRepository {
  Mono<Void> updateBookRatingUnSynced();

  Mono<Isbn> rate(BookRating rating);
}
