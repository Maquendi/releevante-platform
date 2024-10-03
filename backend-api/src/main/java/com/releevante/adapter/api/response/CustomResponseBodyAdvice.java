package com.releevante.adapter.api.response;

import java.util.List;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.reactivestreams.Publisher;
import org.springframework.http.codec.HttpMessageWriter;
import org.springframework.web.reactive.HandlerResult;
import org.springframework.web.reactive.accept.RequestedContentTypeResolver;
import org.springframework.web.reactive.result.method.annotation.ResponseBodyResultHandler;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
public class CustomResponseBodyAdvice extends ResponseBodyResultHandler {
  public CustomResponseBodyAdvice(
      List<HttpMessageWriter<?>> writers, RequestedContentTypeResolver resolver) {
    super(writers, resolver);
  }

  // s.setMethod(exchange.getRequest().getMethod().name());
  // s.setStatus(exchange.getResponse().getStatusCode().value());
  // s.setCorrelationId(exchange.getAttribute("correlation-id"));

  @Override
  public Mono<Void> handleResult(ServerWebExchange exchange, HandlerResult result) {

    var responseBuilder =
        ApiResponse.builder()
            .statusCode(Objects.requireNonNull(exchange.getResponse().getStatusCode()).value());

    if (Objects.nonNull(getAdapter(result))) {
      Flux<ApiResponse> body =
          Flux.from((Publisher<?>) Objects.requireNonNull(result.getReturnValue()))
              .map(data -> ResponseContext.builder().data(data).build())
              .map(responseContext -> responseBuilder.context(responseContext).build());
      return writeBody(body, result.getReturnTypeSource().nested(), exchange);
    } else {
      var context = ResponseContext.builder().data(result.getReturnValue()).build();
      Mono<ApiResponse> body = Mono.just(responseBuilder.context(context).build());
      return writeBody(body, result.getReturnTypeSource().nested(), exchange);
    }
  }
}
