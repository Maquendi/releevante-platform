package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.ServiceRating;
import java.util.Objects;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "service_ratings", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class ServiceRatingRecord extends AuditableEntity {
  @Id private String id;
  private int rating;

  public static ServiceRatingRecord fromDomain(ServiceRating rating) {
    var record = new ServiceRatingRecord();
    record.setId(rating.audit());
    record.setRating(rating.rating());
    record.setCreatedAt(rating.createdAt());
    record.setAudit(rating.audit());
    record.setOrigin(rating.origin());
    return record;
  }

  public ServiceRating toDomain() {
    return ServiceRating.builder()
        .id(id)
        .createdAt(createdAt)
        .audit(audit)
        .origin(origin)
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
