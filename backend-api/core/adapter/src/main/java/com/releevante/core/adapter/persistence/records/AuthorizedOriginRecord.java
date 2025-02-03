package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.OrgId;
import com.releevante.core.domain.SmartLibrary;
import com.releevante.types.Slid;
import java.util.Collections;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "authorized_origins", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class AuthorizedOriginRecord extends PersistableEntity {

  @Id String id;
  String type;
  String orgId;
  boolean isActive;

  public SmartLibrary toLibrary() {
    return SmartLibrary.builder()
        .id(Slid.of(id))
        .createdAt(createdAt)
        .modelName(type)
        .updatedAt(updatedAt)
        .orgId(OrgId.of(orgId))
        .statuses(Collections.emptyList())
        .clients(Collections.emptyList())
        .build();
  }
}
