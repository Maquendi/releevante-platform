package com.releevante.core.adapter.persistence.dao.projections;

import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookTagProjection {
  private String id;
  private String name;
  private String valueEn;
  private String valueFr;
  private String valueSp;
  private ZonedDateTime createdAt;
}
