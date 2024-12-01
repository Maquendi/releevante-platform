package com.releevante.core.adapter.persistence.records;

import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "smart_library_access_ctrl", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class SmartLibraryAccessControlRecord extends PersistableEntity {
  @Id private String id;
  private String orgId;
  private String slid;
  private String credential;
  private String credentialType;
  private String userId;
  private boolean isActive;
  private boolean isSync;
  private ZonedDateTime expiresAt;
  private int accessDueDays;
}
