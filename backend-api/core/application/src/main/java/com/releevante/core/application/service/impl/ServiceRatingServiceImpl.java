package com.releevante.core.application.service.impl;

import com.releevante.core.application.dto.clients.reviews.ServiceReviewDto;
import com.releevante.core.application.identity.service.auth.AuthorizationService;
import com.releevante.core.application.service.ServiceRatingService;
import com.releevante.core.domain.repository.ratings.ServiceRatingRepository;
import com.releevante.types.SequentialGenerator;
import com.releevante.types.UuidGenerator;
import com.releevante.types.ZonedDateTimeGenerator;
import java.time.ZonedDateTime;
import reactor.core.publisher.Mono;

public class ServiceRatingServiceImpl implements ServiceRatingService {

  final ServiceRatingRepository serviceRatingRepository;

  final AuthorizationService authorizationService;

  final SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();

  final SequentialGenerator<ZonedDateTime> dateTimeGenerator = ZonedDateTimeGenerator.instance();

  public ServiceRatingServiceImpl(
      ServiceRatingRepository serviceRatingRepository, AuthorizationService authorizationService) {
    this.serviceRatingRepository = serviceRatingRepository;
    this.authorizationService = authorizationService;
  }

  @Override
  public Mono<String> create(ServiceReviewDto ratingDto) {
    return authorizationService
        .getAccountPrincipal()
        .map(principal -> ratingDto.toDomain(principal, uuidGenerator, dateTimeGenerator))
        .flatMap(serviceRatingRepository::create);
  }
}
