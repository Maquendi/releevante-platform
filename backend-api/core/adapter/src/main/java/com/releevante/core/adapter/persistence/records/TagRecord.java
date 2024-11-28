package com.releevante.core.adapter.persistence.records;

import com.releevante.types.SequentialGenerator;
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

  public static TagRecord fromKeyWord(SequentialGenerator<String> uuidGenerator, String keyWord) {
    var record = new TagRecord();
    record.setName("keyWord");
    record.setId(uuidGenerator.next());
    record.setValue(keyWord);
    return record;
  }
}
