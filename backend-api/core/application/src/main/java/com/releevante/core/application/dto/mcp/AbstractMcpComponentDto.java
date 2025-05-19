package com.releevante.core.application.dto.mcp;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.Map;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableExt
@JsonDeserialize(as = McpComponentDto.class)
@JsonSerialize(as = McpComponentDto.class)
public abstract class AbstractMcpComponentDto {
  abstract String name();

  abstract String description();

  abstract String type();

  abstract Map<String, Object> properties();
}
