package com.releevante.identity.domain.repository;

import com.releevante.identity.domain.model.Privilege;
import com.releevante.identity.domain.model.Role;
import java.util.List;
import reactor.core.publisher.Flux;

public interface PrivilegeRepository {

  Flux<Privilege> findBy(List<Role> roles);
}
