package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.ServiceRating;
import java.time.ZonedDateTime;
import java.util.Objects;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "service_ratings", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class ServiceRatingRecord extends PersistableEntity {
  @Id
  @Column("client_id")
  private String id;

  private String orgId;

  private int rating;

  ZonedDateTime createdAt;

  ZonedDateTime updatedAt;

  protected static ServiceRatingRecord fromDomain(ClientRecord client, ServiceRating rating) {
    var record = new ServiceRatingRecord();
    record.setId(client.getId());
    record.setRating(rating.rating());
    record.setCreatedAt(rating.createdAt());
    record.setUpdatedAt(rating.updatedAt());
    return record;
  }

  public ServiceRating toDomain() {
    return ServiceRating.builder()
        .id(id)
        .createdAt(createdAt)
        .updatedAt(updatedAt)
        .rating(rating)
        .build();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    ServiceRatingRecord that = (ServiceRatingRecord) o;
    return Objects.equals(id, that.id);
  }

  @Override
  public int hashCode() {
    return getClass().hashCode();
  }
}
