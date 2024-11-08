package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.ServiceRating;
import jakarta.persistence.*;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "service_ratings", schema = "core")
@Getter
@Setter
@NoArgsConstructor
@Entity
public class ServiceRatingRecord {
  private String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "id")
  private ClientRecord client;

  private int rating;

  public static ServiceRatingRecord fromDomain(ServiceRating rating) {
    var record = new ServiceRatingRecord();
    record.setId(rating.id());
    record.setRating(rating.rating());
    record.setClient(ClientRecord.from(rating.clientId()));
    return record;
  }

  public static Set<ServiceRatingRecord> fromDomain(List<ServiceRating> serviceRatings) {
    return serviceRatings.stream().map(ServiceRatingRecord::fromDomain).collect(Collectors.toSet());
  }
}
