package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.Book;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "book_tags", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class BookTagRecord extends PersistableEntity {
  String id;
  String isbn;
  String tagId;
  ZonedDateTime createdAt;

  public static BookTagRecord from(
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator,
      Book book,
      TagRecord tag) {
    var record = new BookTagRecord();
    record.setId(uuidGenerator.next());
    record.setIsbn(book.isbn().value());
    record.setTagId(tag.getId());
    record.setCreatedAt(dateTimeGenerator.next());
    return record;
  }
}
