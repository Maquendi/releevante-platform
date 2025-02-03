package com.releevante.identity.adapter.persistence.repository;

import com.releevante.identity.adapter.persistence.records.AuthorizedOriginRecord;
import com.releevante.identity.adapter.persistence.repository.components.AuthorizedOriginHibernateDao;
import com.releevante.identity.domain.model.AuthorizedOrigin;
import com.releevante.identity.domain.repository.AuthorizedOriginRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class AuthorizedOriginRepositoryImpl implements AuthorizedOriginRepository {

  final AuthorizedOriginHibernateDao authorizedOriginHibernateDao;

  public AuthorizedOriginRepositoryImpl(AuthorizedOriginHibernateDao authorizedOriginHibernateDao) {
    this.authorizedOriginHibernateDao = authorizedOriginHibernateDao;
  }

  @Override
  public Mono<AuthorizedOrigin> findById(String id) {
    return authorizedOriginHibernateDao.findById(id).map(AuthorizedOriginRecord::toDomain);
  }
}
