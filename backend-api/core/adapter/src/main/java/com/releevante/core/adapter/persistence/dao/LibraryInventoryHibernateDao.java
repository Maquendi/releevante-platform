package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.LibraryInventoryRecord;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public interface LibraryInventoryHibernateDao
    extends JpaRepository<LibraryInventoryRecord, String> {

  @Modifying
  @Query("update LibraryInventoryRecord lir set lir.status = :status where lir.cpy in (:copies)")
  int updateInventoryStatusByCpy(
      @Param("status") String status, @Param("copies") Set<String> copies);
}
