package com.releevante.core.application.service;

import com.releevante.core.application.dto.ServiceRatingDto;
import reactor.core.publisher.Mono;

public interface ServiceRatingService {
  Mono<String> create(ServiceRatingDto rating);
}
