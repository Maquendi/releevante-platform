package com.releevante.identity.adapter.persistence.repository;

import com.releevante.identity.adapter.persistence.records.RoleRecord;
import com.releevante.identity.adapter.persistence.repository.components.RoleDao;
import com.releevante.identity.domain.model.Privilege;
import com.releevante.identity.domain.model.Role;
import com.releevante.identity.domain.repository.PrivilegeRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class PrivilegeRepositoryImpl implements PrivilegeRepository {
  final RoleDao roleDao;

  public PrivilegeRepositoryImpl(RoleDao roleDao) {
    this.roleDao = roleDao;
  }

  @Override
  public Flux<Privilege> findBy(List<Role> roles) {
    return Mono.just(roles.stream().map(Role::value).collect(Collectors.toList()))
        .flatMapIterable(roleDao::findByRoleIn)
        .map(RoleRecord::toPrivilege);
  }
}
