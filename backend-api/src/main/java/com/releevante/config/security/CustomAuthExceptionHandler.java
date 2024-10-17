package com.releevante.config.security;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.releevante.adapter.api.response.CustomApiResponse;
import com.releevante.adapter.api.response.ResponseContext;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

public class CustomAuthExceptionHandler {

  public static ObjectMapper objectMapper = new ObjectMapper();

  public static Mono<Void> commence(ServerWebExchange exchange, Throwable ex, HttpStatus status) {

    return Mono.fromCallable(
            () -> {
              String message = ex.getMessage();

              var apiResponse =
                  CustomApiResponse.builder()
                      .statusCode(status.value())
                      .context(ResponseContext.builder().data(message).build())
                      .build();
              String apiResponseStr;
              try {
                apiResponseStr = objectMapper.writeValueAsString(apiResponse);
              } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
              }
              byte[] bytes = apiResponseStr.getBytes(StandardCharsets.UTF_8);
              return exchange.getResponse().bufferFactory().wrap(bytes);
            })
        .flatMap(
            buffer -> {
              ServerHttpResponse response = exchange.getResponse();
              response.setStatusCode(status);
              response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
              response.getHeaders().setContentLength(buffer.toByteBuffer().remaining());

              return response.writeWith(Mono.just(buffer));
            });
  }
}
