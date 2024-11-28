package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.tags.Tag;
import com.releevante.core.domain.tags.TagTypes;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import java.util.Optional;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = TagDto.class)
@JsonSerialize(as = TagDto.class)
@ImmutableExt
public abstract class AbstractTagDto {
  abstract TagTypes tagName();

  abstract String tagValue();

  abstract Optional<String> tagValueFr();

  abstract Optional<String> tagValueSp();

  public Tag toDomain(
      SequentialGenerator<String> uuidGen, SequentialGenerator<ZonedDateTime> datetimeGen) {
    return Tag.builder()
        .id(uuidGen.next())
        .name(tagName().name())
        .value(tagValue())
        .valueFr(tagValueFr())
        .valueSp(tagValueSp())
        .createdAt(datetimeGen.next())
        .build();
  }
}
