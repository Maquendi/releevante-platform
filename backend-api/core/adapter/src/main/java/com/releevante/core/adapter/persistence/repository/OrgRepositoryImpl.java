package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.OrgDao;
import com.releevante.core.adapter.persistence.records.OrgRecord;
import com.releevante.core.domain.identity.model.OrgId;
import com.releevante.core.domain.identity.model.Organization;
import com.releevante.core.domain.identity.repository.OrgRepository;
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
    return orgDao.save(OrgRecord.from(organization)).thenReturn(organization);
  }

  @Override
  public Mono<Organization> findBy(OrgId orgId) {
    return orgDao.findById(orgId.value()).map(OrgRecord::toDomain);
  }
}
