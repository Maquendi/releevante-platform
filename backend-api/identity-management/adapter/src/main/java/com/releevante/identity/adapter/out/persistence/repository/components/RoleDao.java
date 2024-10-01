package com.releevante.identity.adapter.out.persistence.repository.components;

import com.releevante.identity.adapter.out.persistence.records.RoleRecord;
import com.releevante.identity.adapter.out.persistence.records.RolesPrivilegePK;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleDao extends JpaRepository<RoleRecord, RolesPrivilegePK> {
  List<RoleRecord> findAllByRole(String role);

  List<RoleRecord> findByRoleIn(List<String> role);
}
