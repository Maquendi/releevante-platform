package com.releevante.core.adapter.persistence.repository;

import com.releevante.core.adapter.persistence.dao.RoleDao;
import com.releevante.core.adapter.persistence.dao.projections.PrivilegeProjection;
import com.releevante.core.domain.identity.model.Privilege;
import com.releevante.core.domain.identity.model.Role;
import com.releevante.core.domain.identity.repository.PrivilegeRepository;
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
        .flatMapMany(roleDao::findAllPrivilegeBy)
        .map(this::toPrivilege);
  }

  public Privilege toPrivilege(PrivilegeProjection projection) {
    return Privilege.of(projection.getPrivilege());
  }
}
