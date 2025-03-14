package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.identity.model.SmartLibraryAccess;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "smart_library_granted_access", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class SmartLibraryGrantedAccessRecord extends PersistableEntity {
  @Id private String id;
  private String slid;
  private String accessId;
  private boolean isSynced;

  public static Set<SmartLibraryGrantedAccessRecord> fromDomain(SmartLibraryAccess access) {
    return access.slid().stream()
        .map(
            slid -> {
              var record = new SmartLibraryGrantedAccessRecord();
              record.setId(access.id());
              record.setSlid(slid);
              record.setCreatedAt(access.createdAt());
              record.setUpdatedAt(access.updatedAt());
              record.setAccessId(access.id());
              return record;
            })
        .collect(Collectors.toSet());
  }
}
