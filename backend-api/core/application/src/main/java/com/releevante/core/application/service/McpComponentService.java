package com.releevante.core.application.service;

import com.releevante.core.application.dto.mcp.McpComponentDto;
import com.releevante.core.application.dto.mcp.McpServerDto;
import com.releevante.types.McpPrompt;
import com.releevante.types.McpResource;
import com.releevante.types.McpServer;
import com.releevante.types.McpTool;
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.lang.reflect.Parameter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.reactivestreams.Publisher;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.SignalType;
import reactor.core.scheduler.Schedulers;

@Service
@Slf4j
public class McpComponentService {

  private static final String MCP_SERVERS_PACKAGE = "com.releevante.core.application.mcp_servers";
  private static final long CACHE_TTL_MINUTES = 5;
  private final ClassPathScanningCandidateComponentProvider scanner;

  public McpComponentService(ClassPathScanningCandidateComponentProvider scanner) {
    this.scanner = scanner;
    this.scanner.addIncludeFilter(new AnnotationTypeFilter(McpServer.class));
  }

  @Cacheable(value = "mcpComponents", key = "'all'", unless = "#result == null")
  public Flux<McpServerDto> getMcpServerList() {
    return scanMcpComponents()
        .cache()
        .publishOn(Schedulers.boundedElastic())
        .doFinally(
            signalType -> {
              if (signalType == SignalType.CANCEL) {
                log.debug("MCP components scan was cancelled");
              }
            });
  }

  protected Flux<McpServerDto> scanMcpComponents() {
    return Flux.fromStream(scanner.findCandidateComponents(MCP_SERVERS_PACKAGE).stream())
        .flatMap(
            beanDefinition -> {
              try {
                Class<?> clazz = Class.forName(beanDefinition.getBeanClassName());
                return scanClassForComponents(clazz)
                    .collectList()
                    .map(
                        components -> {
                          return McpServerDto.builder()
                              .name(clazz.getSimpleName())
                              .components(components)
                              .build();
                        });
              } catch (ClassNotFoundException e) {
                log.error("Failed to load class: {}", beanDefinition.getBeanClassName(), e);
                return Flux.empty();
              } catch (Exception e) {
                log.error(
                    "Unexpected error scanning class: {}", beanDefinition.getBeanClassName(), e);
                return Flux.error(e);
              }
            })
        .onErrorResume(
            e -> {
              log.error("Error scanning MCP components", e);
              return Flux.empty();
            });
  }

  private Flux<McpComponentDto> scanClassForComponents(Class<?> clazz) {
    Flux<McpComponentDto> tools = scanClassForTools(clazz);
    Flux<McpComponentDto> resources = scanClassForResources(clazz);
    Flux<McpComponentDto> prompts = scanClassForPrompts(clazz);

    return Flux.merge(tools, resources, prompts);
  }

  private Flux<McpComponentDto> scanClassForTools(Class<?> clazz) {
    return Flux.fromArray(clazz.getDeclaredMethods())
        .filter(method -> method.isAnnotationPresent(McpTool.class))
        .map(
            method -> {
              McpTool toolAnnotation = method.getAnnotation(McpTool.class);
              Map<String, Object> properties = new HashMap<>();
              properties.put("parameters", getParameterMap(method));

              return McpComponentDto.builder()
                  .name(toolAnnotation.name())
                  .description(toolAnnotation.description())
                  .type("tool")
                  .properties(properties)
                  .build();
            });
  }

  private Flux<McpComponentDto> scanClassForResources(Class<?> clazz) {
    return Flux.fromArray(clazz.getDeclaredMethods())
        .filter(method -> method.isAnnotationPresent(McpResource.class))
        .map(
            method -> {
              McpResource resourceAnnotation = method.getAnnotation(McpResource.class);
              Map<String, Object> properties = new HashMap<>();
              properties.put("parameters", getParameterMap(method));

              return McpComponentDto.builder()
                  .name(resourceAnnotation.name())
                  .description(resourceAnnotation.description())
                  .type("resource")
                  .properties(properties)
                  .build();
            });
  }

  private Flux<McpComponentDto> scanClassForPrompts(Class<?> clazz) {
    return Flux.fromArray(clazz.getDeclaredMethods())
        .filter(method -> method.isAnnotationPresent(McpPrompt.class))
        .map(
            method -> {
              McpPrompt promptAnnotation = method.getAnnotation(McpPrompt.class);
              Map<String, Object> properties = new HashMap<>();
              properties.put("parameters", getParameterMap(method));

              return McpComponentDto.builder()
                  .name(promptAnnotation.name())
                  .description(promptAnnotation.description())
                  .type("prompt")
                  .properties(properties)
                  .build();
            });
  }

  private Map<String, String> getParameterMap(Method method) {
    Map<String, String> parameters = new HashMap<>();
    Parameter[] params = method.getParameters();
    for (Parameter param : params) {
      parameters.put(param.getName(), param.getType().getSimpleName());
    }
    return parameters;
  }

  public Mono<?> executeMcpComponent(
      String mcpServerName,
      String mcpComponentType,
      String mcpComponentName,
      Map<String, Object> args) {
    try {
      Class<?> serverClass = findMcpServerClass(mcpServerName);
      if (serverClass == null) {
        return Mono.error(new IllegalArgumentException("MCP server not found: " + mcpServerName));
      }

      return switch (mcpComponentType.toLowerCase()) {
        case "tool" -> executeMcpTool(serverClass, mcpComponentName, args);
        case "resource" -> executeMcpResource(serverClass, mcpComponentName, args);
        case "prompt" -> executeMcpPrompt(serverClass, mcpComponentName, args);
        default -> Mono.error(
            new IllegalArgumentException("Invalid MCP component type: " + mcpComponentType));
      };
    } catch (Exception e) {
      log.error(
          "Error executing MCP component: {} in server: {}", mcpComponentName, mcpServerName, e);
      return Mono.error(e);
    }
  }

  private Mono<?> executeMcpTool(Class<?> serverClass, String toolName, Map<String, Object> args) {
    Method targetMethod = findAnnotatedMethod(serverClass, McpTool.class, toolName);
    if (targetMethod == null) {
      return Mono.error(new IllegalArgumentException("MCP tool not found: " + toolName));
    }

    return executeMethod(serverClass, targetMethod, args);
  }

  private Mono<?> executeMcpResource(
      Class<?> serverClass, String resourceName, Map<String, Object> args) {
    Method targetMethod = findAnnotatedMethod(serverClass, McpResource.class, resourceName);
    if (targetMethod == null) {
      return Mono.error(new IllegalArgumentException("MCP resource not found: " + resourceName));
    }

    return executeMethod(serverClass, targetMethod, args);
  }

  private Mono<?> executeMcpPrompt(
      Class<?> serverClass, String promptName, Map<String, Object> args) {
    Method targetMethod = findAnnotatedMethod(serverClass, McpPrompt.class, promptName);
    if (targetMethod == null) {
      return Mono.error(new IllegalArgumentException("MCP prompt not found: " + promptName));
    }

    return executeMethod(serverClass, targetMethod, args);
  }

  private <T extends Annotation> Method findAnnotatedMethod(
      Class<?> serverClass, Class<T> annotationType, String name) {
    return Arrays.stream(serverClass.getDeclaredMethods())
        .filter(method -> method.isAnnotationPresent(annotationType))
        .filter(
            method -> {
              try {
                T annotation = method.getAnnotation(annotationType);
                Method nameMethod = annotationType.getMethod("name");
                String annotationName = (String) nameMethod.invoke(annotation);
                return annotationName.equals(name);
              } catch (Exception e) {
                log.error("Error getting name from annotation", e);
                return false;
              }
            })
        .findFirst()
        .orElse(null);
  }

  private Mono<?> executeMethod(Class<?> serverClass, Method method, Map<String, Object> args) {
    try {
      Object serverInstance = serverClass.getDeclaredConstructor().newInstance();
      Object[] methodArgs = prepareMethodArguments(method, args);
      Object result = method.invoke(serverInstance, methodArgs);

      if (result instanceof Publisher) {
        return Mono.from((Publisher<?>) result);
      }
      return Mono.just(result);
    } catch (Exception e) {
      return Mono.error(e);
    }
  }

  private Class<?> findMcpServerClass(String serverName) {
    return scanner.findCandidateComponents(MCP_SERVERS_PACKAGE).stream()
        .filter(
            beanDefinition ->
                Objects.requireNonNull(beanDefinition.getBeanClassName()).endsWith(serverName))
        .findFirst()
        .map(
            beanDefinition -> {
              try {
                return Class.forName(beanDefinition.getBeanClassName());
              } catch (ClassNotFoundException e) {
                log.error("Failed to load MCP server class: {}", serverName, e);
                return null;
              }
            })
        .orElse(null);
  }

  private Object[] prepareMethodArguments(Method method, Map<String, Object> args) {
    Parameter[] parameters = method.getParameters();
    if (parameters.length == 0) {
      return new Object[0];
    }

    return args.values().toArray();
  }
}
