package com.releevante.core.application.service;

import com.releevante.core.application.dto.clients.reviews.ServiceReviewDto;
import reactor.core.publisher.Mono;

public interface ServiceRatingService {
  Mono<String> create(ServiceReviewDto rating);
}
