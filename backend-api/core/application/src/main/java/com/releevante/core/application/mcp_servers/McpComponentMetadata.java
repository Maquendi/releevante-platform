package com.releevante.core.application.mcp_servers;

import java.util.Map;
import lombok.Builder;
import lombok.Data;
import reactor.core.publisher.Mono;

/** Metadata for an MCP component including its type, description, and parameter information. */
@Data
@Builder
public class McpComponentMetadata {
  private String name;
  private String type; // "tool", "resource", or "prompt"
  private String description;
  private Map<String, String> parameters; // parameter name -> parameter type
  private String methodName; // The actual method name in the class
  private String serverName; // The name of the server class this component belongs to

  @FunctionalInterface
  public interface McpFunction {
    Mono<?> execute(Object... args);
  }

  private McpFunction function; // The executable function for this component
}
