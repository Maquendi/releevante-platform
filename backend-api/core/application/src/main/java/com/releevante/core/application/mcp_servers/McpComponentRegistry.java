package com.releevante.core.application.mcp_servers;

import java.util.HashMap;
import java.util.Map;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

/**
 * Singleton registry for managing MCP components. This class maintains a central repository of all
 * MCP components in the application.
 */
@Component
public class McpComponentRegistry {
  private static McpComponentRegistry instance;
  private final Map<String, McpComponentMetadata> mcpComponents;

  public McpComponentRegistry() {
    mcpComponents = new HashMap<>();
  }

  public static synchronized McpComponentRegistry getInstance() {
    if (instance == null) {
      instance = new McpComponentRegistry();
    }
    return instance;
  }

  /**
   * Register an MCP component with its metadata and function
   *
   * @param identifier The unique identifier for the MCP component
   * @param metadata The component metadata with function
   */
  public void registerComponent(String identifier, McpComponentMetadata metadata) {
    mcpComponents.put(identifier, metadata);
  }

  /** Get metadata for an MCP component */
  public McpComponentMetadata getComponent(String identifier) {
    return mcpComponents.get(identifier);
  }

  /** Execute a function by its identifier */
  public Mono<?> executeFunction(String identifier, Object... args) {
    McpComponentMetadata metadata = mcpComponents.get(identifier);
    if (metadata == null || metadata.getFunction() == null) {
      return Mono.error(
          new IllegalArgumentException("No function found for identifier: " + identifier));
    }
    return metadata.getFunction().execute(args);
  }

  /** Get all registered MCP components */
  public Map<String, McpComponentMetadata> getAllComponents() {
    return Map.copyOf(mcpComponents);
  }

  /** Remove a component from the registry */
  public void removeComponent(String identifier) {
    mcpComponents.remove(identifier);
  }

  /** Clear all registered components */
  public void clearRegistry() {
    mcpComponents.clear();
  }
}
