package com.releevante.core.adapter.persistence.dao;

import com.releevante.core.adapter.persistence.records.LibraryInventoryRecord;
import java.util.Set;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface LibraryInventoryHibernateDao
    extends ReactiveCrudRepository<LibraryInventoryRecord, String> {

  @Modifying
  @Query("update core.library_inventories set status = :status where cpy in (:copies)")
  Mono<Void> updateInventoryStatusByCpy(
      @Param("status") String status, @Param("copies") Set<String> copies);
}
