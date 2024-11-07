package com.releevante.identity.adapter.out.persistence.records;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "smart_library", schema = "identity_management")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class SmartLibraryRecord {
  @Id private String slid;
  private String orgId;
  private boolean isActive;
}
