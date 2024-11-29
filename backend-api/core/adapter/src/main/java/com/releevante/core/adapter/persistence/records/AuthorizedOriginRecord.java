package com.releevante.core.adapter.persistence.records;

import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "authorized_origins", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class AuthorizedOriginRecord extends PersistableEntity {
  String id;
  String type;
  ZonedDateTime createdAt;
  ZonedDateTime updatedAt;
}
