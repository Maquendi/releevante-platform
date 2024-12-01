package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.BookImage;
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

  public BookImage toDomain() {
    return BookImage.builder().id(id).isbn(isbn).url(url).sourceUrl(sourceUrl).build();
  }

  public static BookImageRecord from(BookImage image) {
    var record = new BookImageRecord();
    record.setId(image.id());
    record.setIsbn(image.isbn());
    record.setUrl(image.url());
    record.setSourceUrl(image.sourceUrl());
    return record;
  }
}
