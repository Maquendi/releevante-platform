package com.main.config.logging;

import com.releevante.types.SequentialGenerator;
import com.releevante.types.UuidGenerator;
import java.util.Objects;
import reactor.core.publisher.Mono;
import reactor.util.context.Context;

public class CorrelationIdUtils {
  public static final String CORRELATION_ID = "X-Trace-Id";

  public static final SequentialGenerator<String> uuidGenerator = UuidGenerator.instance();

  public static String getCorrelationId() {
    return Mono.deferContextual(
            ctx ->
                Mono.just(
                    Objects.requireNonNull(ctx.getOrDefault(CORRELATION_ID, uuidGenerator.next()))))
        .block();
  }

  public static Mono<Context> withCorrelationId(Context context, String correlationId) {
    return Mono.just(context.put(CORRELATION_ID, correlationId));
  }

  public static String generateCorrelationId() {
    return uuidGenerator.next();
  }
}
