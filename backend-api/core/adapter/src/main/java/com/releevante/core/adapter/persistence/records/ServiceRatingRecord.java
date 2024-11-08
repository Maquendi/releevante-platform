package com.releevante.core.adapter.persistence.records;

import jakarta.persistence.*;
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
}
