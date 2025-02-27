package com.releevante.core.adapter.persistence.dao.projections;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookCopyProjection {
  private String cpy;
  private String isbn;
  private String slid;
  private BigDecimal price;
  private String title;
  private String author;
  private String lang;
  private String correlationId;
  private String translationId;
  private String description;
  private String descriptionFr;
  private String descriptionEs;
  private String status;
  private int usageCount;
  private ZonedDateTime createdAt;
  private ZonedDateTime updatedAt;
  private boolean isSynced;
  private int printLength;
  private LocalDate publishDate;
  public String dimensions;
  private String publicIsbn;
  public String publisher;
  public String bindingType;
  public float rating;
  public int votes;
  public String allocation;
}
