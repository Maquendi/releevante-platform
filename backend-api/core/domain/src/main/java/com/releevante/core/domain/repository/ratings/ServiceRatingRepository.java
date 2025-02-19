package com.releevante.core.domain.repository.ratings;

import com.releevante.core.domain.ServiceRating;
import reactor.core.publisher.Mono;

public interface ServiceRatingRepository {
  Mono<String> create(ServiceRating rating);
}
