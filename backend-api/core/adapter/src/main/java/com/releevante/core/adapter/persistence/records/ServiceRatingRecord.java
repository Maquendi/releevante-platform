package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.Client;
import com.releevante.core.domain.ServiceRating;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "service_ratings", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class ServiceRatingRecord {
  @Id private String id;

  @OneToOne(fetch = FetchType.LAZY)
  @MapsId
  private ClientRecord client;

  private int rating;

  ZonedDateTime createdAt;

  ZonedDateTime updatedAt;

  protected static ServiceRatingRecord fromDomain(Client client) {
    var record = new ServiceRatingRecord();
    var rating = client.serviceRating().get();
    record.setId(rating.id());
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
}
