package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.SmartLibraryStatus;
import com.releevante.core.domain.types.SmartLibraryState;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "smart_library_events", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class SmartLibraryEventRecord {
  String id;
  SmartLibraryState eventType;
  ZonedDateTime createdAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id")
  private SmartLibraryRecord smartLibrary;

  public SmartLibraryStatus toDomain() {
    return SmartLibraryStatus.builder().state(eventType).createdAt(createdAt).build();
  }

  public static List<SmartLibraryStatus> toDomain(Set<SmartLibraryEventRecord> events) {
    return events.stream().map(SmartLibraryEventRecord::toDomain).collect(Collectors.toList());
  }
}
