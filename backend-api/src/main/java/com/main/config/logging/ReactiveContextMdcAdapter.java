package com.main.config.logging;

import java.util.function.Consumer;
import org.slf4j.MDC;
import reactor.core.publisher.Signal;
import reactor.util.context.ContextView;

public class ReactiveContextMdcAdapter {

  public static <T> Consumer<Signal<T>> withContext() {
    return signal -> {
      if (!signal.isOnComplete() && !signal.isOnError()) {
        ContextView contextView = signal.getContextView();
        if (contextView.hasKey(CorrelationIdUtils.CORRELATION_ID)) {
          String correlationId = contextView.get(CorrelationIdUtils.CORRELATION_ID);
          MDC.put(CorrelationIdUtils.CORRELATION_ID, correlationId);
        }
      } else {
        MDC.clear();
      }
    };
  }

  public static <T> Consumer<Signal<T>> clearContext() {
    return signal -> MDC.clear();
  }
}
