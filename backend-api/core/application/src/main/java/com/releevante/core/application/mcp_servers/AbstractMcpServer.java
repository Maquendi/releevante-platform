package com.releevante.core.application.mcp_servers;

import com.releevante.types.McpPrompt;
import com.releevante.types.McpResource;
import com.releevante.types.McpTool;
import jakarta.annotation.PostConstruct;
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;

/**
 * Abstract base class for MCP servers that provides automatic registration of methods annotated
 * with @McpTool, @McpResource, and @McpPrompt.
 */
public abstract class AbstractMcpServer {

  private static final Logger log = LoggerFactory.getLogger(AbstractMcpServer.class);

  protected final McpComponentRegistry registry;

  // List of supported MCP component types and their annotations
  private static final List<Class<? extends Annotation>> MCP_COMPONENT_TYPES =
      Arrays.asList(McpTool.class, McpResource.class, McpPrompt.class);

  protected AbstractMcpServer() {
    this.registry = McpComponentRegistry.getInstance();
  }

  /**
   * Automatically registers all MCP components (tools, resources, prompts) in the component
   * registry.
   */
  @PostConstruct
  protected void registerMcpComponents() {
    Method[] methods = this.getClass().getDeclaredMethods();

    MCP_COMPONENT_TYPES.forEach(
        annotationType ->
            registerComponentsOfType(
                methods, annotationType, getComponentTypeName(annotationType)));
  }

  /** Register components of a specific type based on their annotation */
  private <A extends Annotation> void registerComponentsOfType(
      Method[] methods, Class<A> annotationType, String componentType) {
    Arrays.stream(methods)
        .filter(method -> method.isAnnotationPresent(annotationType))
        .forEach(
            method -> {
              try {
                A annotation = method.getAnnotation(annotationType);
                String name = (String) annotationType.getMethod("name").invoke(annotation);
                String description =
                    (String) annotationType.getMethod("description").invoke(annotation);

                // Create the full component identifier
                String componentName =
                    String.format("%s.%s", this.getClass().getSimpleName(), name);

                // Create metadata with function
                McpComponentMetadata metadata =
                    McpComponentMetadata.builder()
                        .name(name)
                        .type(componentType)
                        .description(description)
                        .parameters(getParameterInfo(method))
                        .methodName(method.getName())
                        .serverName(this.getClass().getSimpleName())
                        .function(
                            args -> {
                              try {
                                method.setAccessible(true);
                                return (Mono<?>) method.invoke(this, args);
                              } catch (Exception e) {
                                return Mono.error(
                                    new RuntimeException(
                                        String.format(
                                            "Error executing MCP %s '%s': %s",
                                            componentType, name, e.getMessage()),
                                        e));
                              }
                            })
                        .build();

                // Register component
                registry.registerComponent(componentName, metadata);

                log.debug(
                    "Registered MCP {} '{}' from method '{}'",
                    componentType,
                    componentName,
                    method.getName());
              } catch (Exception e) {
                throw new RuntimeException("Failed to register MCP component", e);
              }
            });
  }

  /** Get a human-readable component type name from the annotation class */
  private String getComponentTypeName(Class<? extends Annotation> annotationType) {
    String name = annotationType.getSimpleName();
    return name.substring(3).toLowerCase(); // Remove "Mcp" prefix and convert to lowercase
  }

  private Map<String, String> getParameterInfo(Method method) {
    Map<String, String> parameters = new HashMap<>();
    for (Parameter parameter : method.getParameters()) {
      parameters.put(parameter.getName(), parameter.getType().getSimpleName());
    }
    return parameters;
  }
}
