package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.ServiceRatingHibernateDao;
import com.releevante.core.adapter.persistence.records.ServiceRatingRecord;
import com.releevante.core.domain.ServiceRating;
import com.releevante.core.domain.repository.ratings.ServiceRatingRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class ServiceRatingRepositoryImpl implements ServiceRatingRepository {
  final ServiceRatingHibernateDao serviceRatingHibernateDao;

  public ServiceRatingRepositoryImpl(ServiceRatingHibernateDao serviceRatingHibernateDao) {
    this.serviceRatingHibernateDao = serviceRatingHibernateDao;
  }

  @Override
  public Mono<String> create(ServiceRating rating) {
    return serviceRatingHibernateDao
        .save(ServiceRatingRecord.fromDomain(rating))
        .map(ServiceRatingRecord::getId);
  }
}
