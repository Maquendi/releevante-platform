package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.SmartLibraryStatus;
import com.releevante.core.domain.types.SmartLibraryState;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "library_events", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class SmartLibraryEventRecord {
  @Id String id;
  SmartLibraryState type;
  ZonedDateTime createdAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "slid")
  private SmartLibraryRecord library;

  public SmartLibraryStatus toDomain() {
    return SmartLibraryStatus.builder().state(type).createdAt(createdAt).build();
  }

  protected static List<SmartLibraryStatus> toDomain(Set<SmartLibraryEventRecord> events) {
    return events.stream().map(SmartLibraryEventRecord::toDomain).collect(Collectors.toList());
  }

  protected static Set<SmartLibraryEventRecord> fromDomain(
      SmartLibraryRecord record, List<SmartLibraryStatus> statuses) {
    return statuses.stream().map(event -> fromDomain(record, event)).collect(Collectors.toSet());
  }

  protected static SmartLibraryEventRecord fromDomain(
      SmartLibraryRecord smartLibraryRecord, SmartLibraryStatus status) {

    var record = new SmartLibraryEventRecord();
    record.setId(status.id());
    record.setType(status.state());
    record.setCreatedAt(status.createdAt());
    record.setLibrary(smartLibraryRecord);

    return record;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    SmartLibraryEventRecord that = (SmartLibraryEventRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
