package com.releevante.core.application.service;

import com.releevante.core.application.dto.mcp.McpComponentDto;
import com.releevante.core.application.dto.mcp.McpServerDto;
import com.releevante.core.application.mcp_servers.McpComponentMetadata;
import com.releevante.core.application.mcp_servers.McpComponentRegistry;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

/**
 * Implementation of MCP component service that uses the McpComponentRegistry. This provides the
 * same functionality as McpComponentService but leverages the centralized registry.
 */
@Service
@Slf4j
public class RegistryMcpComponentService {

  private final McpComponentRegistry registry;

  public RegistryMcpComponentService() {
    this.registry = McpComponentRegistry.getInstance();
  }

  /** Get a list of all MCP servers and their components */
  @Cacheable(value = "mcpComponents", key = "'registry_all'", unless = "#result == null")
  public Flux<McpServerDto> getMcpServerList() {
    return Flux.defer(
        () -> {
          Map<String, List<McpComponentDto>> serverComponents = new HashMap<>();

          // Group components by server using metadata
          registry
              .getAllComponents()
              .values()
              .forEach(
                  metadata -> {
                    String serverName = metadata.getServerName();
                    McpComponentDto componentDto = createComponentDto(metadata);

                    serverComponents
                        .computeIfAbsent(serverName, k -> new ArrayList<>())
                        .add(componentDto);
                  });

          // Convert to McpServerDto objects
          return Flux.fromIterable(serverComponents.entrySet())
              .map(
                  entry ->
                      McpServerDto.builder()
                          .name(entry.getKey())
                          .components(entry.getValue())
                          .build())
              .publishOn(Schedulers.boundedElastic());
        });
  }

  /** Execute an MCP component */
  public Mono<?> executeMcpComponent(
      String mcpServerName,
      String mcpComponentType,
      String mcpComponentName,
      Map<String, Object> args) {

    String fullComponentName = String.format("%s.%s", mcpServerName, mcpComponentName);

    return Mono.defer(
        () -> {
          McpComponentMetadata metadata = registry.getComponent(fullComponentName);
          if (metadata == null) {
            return Mono.error(
                new IllegalArgumentException("Component not found: " + fullComponentName));
          }

          if (!metadata.getType().equals(mcpComponentType)) {
            return Mono.error(
                new IllegalArgumentException(
                    String.format(
                        "Component type mismatch. Expected: %s, Found: %s",
                        mcpComponentType, metadata.getType())));
          }

          try {
            Object[] argArray = prepareArguments(args, metadata.getParameters());
            return metadata.getFunction().execute(argArray);
          } catch (Exception e) {
            log.error(
                "Error executing MCP component: {} in server: {}",
                mcpComponentName,
                mcpServerName,
                e);
            return Mono.error(e);
          }
        });
  }

  /** Create a component DTO from metadata */
  private McpComponentDto createComponentDto(McpComponentMetadata metadata) {
    Map<String, Object> properties = new HashMap<>();
    properties.put("parameters", metadata.getParameters());

    return McpComponentDto.builder()
        .name(metadata.getName())
        .type(metadata.getType())
        .description(metadata.getDescription())
        .properties(properties)
        .build();
  }

  /** Get a specific component by its full name */
  public Mono<McpComponentDto> getComponent(String fullName) {
    return Mono.justOrEmpty(registry.getComponent(fullName)).map(this::createComponentDto);
  }

  /** Get all components of a specific type */
  public Flux<McpComponentDto> getComponentsByType(String type) {
    return Flux.fromIterable(registry.getAllComponents().values())
        .filter(metadata -> metadata.getType().equals(type))
        .map(this::createComponentDto);
  }

  /** Prepare arguments for execution based on parameter metadata */
  private Object[] prepareArguments(Map<String, Object> args, Map<String, String> parameterInfo) {
    return parameterInfo.keySet().stream().map(args::get).toArray();
  }
}
