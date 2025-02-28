package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.Tag;
import com.releevante.core.domain.TagValue;
import com.releevante.core.domain.tags.TagTypes;
import java.util.Optional;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "tags", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class TagRecord extends PersistableEntity {
  @Id private String id;
  private String name;

  @Column("value_en")
  private String value;

  private String valueFr;
  private String valueSp;

  public static TagRecord fromKeyWord(Tag tag) {
    var record = new TagRecord();
    record.setName(TagTypes.keyword.name());
    record.setId(tag.id());
    record.setValue(tag.value().en());
    tag.value().fr().ifPresent(record::setValueFr);
    tag.value().es().ifPresent(record::setValueSp);
    record.setCreatedAt(tag.createdAt());
    return record;
  }

  public static TagRecord from(Tag tag) {
    var record = new TagRecord();
    record.setName(tag.name());
    record.setId(tag.id());
    record.setValue(tag.value().en());
    tag.value().fr().ifPresent(record::setValueFr);
    tag.value().es().ifPresent(record::setValueSp);
    record.setCreatedAt(tag.createdAt());
    return record;
  }

  public Tag toDomain() {
    return Tag.builder()
        .id(id)
        .name(name)
        .value(
            TagValue.builder().en(value).fr(Optional.of(valueFr)).es(Optional.of(valueSp)).build())
        .createdAt(createdAt)
        .build();
  }
}
