package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookImage;
import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "book_image", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class BookImageRecord extends PersistableEntity {
  String id;
  String isbn;
  String url;
  String sourceUrl;
  ZonedDateTime createdAt;
  ZonedDateTime updatedAt;

  public BookImage toDomain() {
    return BookImage.builder().id(id).isbn(isbn).url(url).sourceUrl(sourceUrl).build();
  }
}
