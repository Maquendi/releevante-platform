package com.releevante.core.domain.repository.ratings;

import reactor.core.publisher.Mono;

public interface BookRatingRepository {
  Mono<Void> updateBookRatingUnSynced();
}
