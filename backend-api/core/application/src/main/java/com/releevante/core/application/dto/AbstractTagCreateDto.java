package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.Tag;
import com.releevante.types.ImmutableExt;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = TagCreateDto.class)
@JsonSerialize(as = TagCreateDto.class)
@ImmutableExt
public abstract class AbstractTagCreateDto {
  abstract List<TagDto> tags();

  public List<Tag> toDomain(
      SequentialGenerator<String> uuidGen, SequentialGenerator<ZonedDateTime> datetimeGen) {
    return tags().stream()
        .map(tag -> tag.toDomain(uuidGen, datetimeGen))
        .collect(Collectors.toList());
  }
}
