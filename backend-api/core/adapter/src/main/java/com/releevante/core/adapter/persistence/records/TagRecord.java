package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.tags.Tag;
import com.releevante.core.domain.tags.TagTypes;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import java.util.Optional;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "tags", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class TagRecord extends PersistableEntity {
  private String id;
  private String name;

  @Column("value_en")
  private String value;

  private String valueFr;
  private String valueSp;

  private ZonedDateTime createdAt;

  public static TagRecord fromKeyWord(
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator,
      String keyWord) {
    var record = new TagRecord();
    record.setName(TagTypes.keyword.name());
    record.setId(uuidGenerator.next());
    record.setValue(keyWord);
    record.setCreatedAt(dateTimeGenerator.next());
    return record;
  }

  public static TagRecord from(Tag tag) {
    var record = new TagRecord();
    record.setName(tag.name());
    record.setId(tag.id());
    record.setValue(tag.value());
    tag.valueFr().ifPresent(record::setValueFr);
    tag.valueSp().ifPresent(record::setValueSp);
    record.setCreatedAt(tag.createdAt());
    return record;
  }

  public Tag toDomain() {
    return Tag.builder()
        .id(id)
        .name(name)
        .value(value)
        .valueFr(Optional.of(valueFr))
        .valueSp(Optional.of(valueSp))
        .createdAt(createdAt)
        .build();
  }
}
