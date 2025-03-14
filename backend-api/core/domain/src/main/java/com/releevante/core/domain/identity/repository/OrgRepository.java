/* (C)2024 */
package com.releevante.core.domain.identity.repository;

import com.releevante.core.domain.identity.model.OrgId;
import com.releevante.core.domain.identity.model.Organization;
import reactor.core.publisher.Mono;

public interface OrgRepository {
  Mono<Organization> upsert(Organization organization);

  Mono<Organization> findBy(OrgId orgId);
}
