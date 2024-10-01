package com.releevante.identity.adapter.out.persistence.repository;

import com.releevante.identity.adapter.out.persistence.records.OrgRecord;
import com.releevante.identity.adapter.out.persistence.repository.components.OrgDao;
import com.releevante.identity.domain.model.OrgId;
import com.releevante.identity.domain.model.Organization;
import com.releevante.identity.domain.repository.OrgRepository;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

@Component
public class OrgRepositoryImpl implements OrgRepository {

  final OrgDao orgDao;

  public OrgRepositoryImpl(OrgDao orgDao) {
    this.orgDao = orgDao;
  }

  @Override
  public Mono<Organization> upsert(Organization organization) {
    return Mono.just(OrgRecord.from(organization)).map(orgDao::save).thenReturn(organization);
  }

  @Override
  public Mono<Organization> findBy(OrgId orgId) {
    return null;
  }
}
