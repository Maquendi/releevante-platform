/* (C)2024 */
package com.releevante.identity.domain.repository;

import com.releevante.identity.domain.model.OrgId;
import com.releevante.identity.domain.model.Organization;
import reactor.core.publisher.Mono;

public interface OrgRepository {
  Mono<Organization> upsert(Organization organization);

  Mono<Organization> findBy(OrgId orgId);
}
