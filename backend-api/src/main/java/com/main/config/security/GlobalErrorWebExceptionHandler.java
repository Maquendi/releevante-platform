package com.main.config.security;

import java.util.Map;
import org.springframework.boot.autoconfigure.web.WebProperties;
import org.springframework.boot.autoconfigure.web.reactive.error.AbstractErrorWebExceptionHandler;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.reactive.error.ErrorAttributes;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerCodecConfigurer;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.server.*;
import reactor.core.publisher.Mono;

public class GlobalErrorWebExceptionHandler extends AbstractErrorWebExceptionHandler {
  /**
   * Create a new {@code AbstractErrorWebExceptionHandler}.
   *
   * @param errorAttributes the error attributes
   * @param applicationContext the application context
   * @since 2.4.0
   */
  public GlobalErrorWebExceptionHandler(
      ErrorAttributes errorAttributes,
      WebProperties webProperties,
      ApplicationContext applicationContext,
      ServerCodecConfigurer serverConfigurer) {
    super(errorAttributes, webProperties.getResources(), applicationContext);
    this.setMessageWriters(serverConfigurer.getWriters());
  }

  @Override
  protected RouterFunction<ServerResponse> getRoutingFunction(ErrorAttributes errorAttributes) {
    return RouterFunctions.route(RequestPredicates.all(), this::renderErrorResponse);
  }

  private Mono<ServerResponse> renderErrorResponse(ServerRequest request) {

    Map<String, Object> errorPropertiesMap =
        getErrorAttributes(request, ErrorAttributeOptions.defaults());

    return ServerResponse.status(HttpStatus.BAD_REQUEST)
        .contentType(MediaType.APPLICATION_JSON)
        .body(BodyInserters.fromValue(errorPropertiesMap));
  }
}
