package com.releevante.core.application.dto.mcp;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableExt
@JsonDeserialize(as = McpServerDto.class)
@JsonSerialize(as = McpServerDto.class)
public abstract class AbstractMcpServerDto {
  abstract String name();

  abstract List<McpComponentDto> components();
}
