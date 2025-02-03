package com.releevante.core.domain.repository.ratings;

import com.releevante.core.domain.BookRating;
import reactor.core.publisher.Flux;

public interface BookRatingRepository {
  Flux<BookRating> getByAllUnSynchronized();
}
