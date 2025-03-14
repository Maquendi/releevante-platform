package com.releevante.core.domain.identity.repository;

import com.releevante.core.domain.identity.model.Privilege;
import com.releevante.core.domain.identity.model.Role;
import java.util.List;
import reactor.core.publisher.Flux;

public interface PrivilegeRepository {

  Flux<Privilege> findBy(List<Role> roles);
}
