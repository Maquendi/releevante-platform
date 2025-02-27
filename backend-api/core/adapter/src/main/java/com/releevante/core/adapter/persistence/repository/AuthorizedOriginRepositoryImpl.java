package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.AuthorizedOriginHibernateDao;
import com.releevante.core.adapter.persistence.records.AuthorizedOriginRecord;
import com.releevante.core.domain.identity.model.AuthorizedOrigin;
import com.releevante.core.domain.identity.repository.AuthorizedOriginRepository;
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
