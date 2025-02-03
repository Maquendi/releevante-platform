package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.ServiceRatingRecord;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRatingHibernateDao
    extends ReactiveCrudRepository<ServiceRatingRecord, String> {}
