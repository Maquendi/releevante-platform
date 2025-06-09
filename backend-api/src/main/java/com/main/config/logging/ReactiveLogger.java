package com.main.config.logging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import reactor.core.publisher.Mono;

public class ReactiveLogger {
  private final Logger logger;

  public ReactiveLogger(Class<?> clazz) {
    this.logger = LoggerFactory.getLogger(clazz);
  }

  public void info(String message) {
    Mono.deferContextual(
            ctx -> {
              if (ctx.hasKey(CorrelationIdUtils.CORRELATION_ID)) {
                String correlationId = ctx.get(CorrelationIdUtils.CORRELATION_ID);
                try {
                  MDC.put(CorrelationIdUtils.CORRELATION_ID, correlationId);
                  logger.info(message);
                } finally {
                  MDC.clear();
                }
              } else {
                logger.info(message);
              }
              return Mono.empty();
            })
        .subscribe();
  }

  public void debug(String message) {
    Mono.deferContextual(
            ctx -> {
              if (ctx.hasKey(CorrelationIdUtils.CORRELATION_ID)) {
                String correlationId = ctx.get(CorrelationIdUtils.CORRELATION_ID);
                try {
                  MDC.put(CorrelationIdUtils.CORRELATION_ID, correlationId);
                  logger.debug(message);
                } finally {
                  MDC.clear();
                }
              } else {
                logger.debug(message);
              }
              return Mono.empty();
            })
        .subscribe();
  }

  public void warn(String message) {
    Mono.deferContextual(
            ctx -> {
              if (ctx.hasKey(CorrelationIdUtils.CORRELATION_ID)) {
                String correlationId = ctx.get(CorrelationIdUtils.CORRELATION_ID);
                try {
                  MDC.put(CorrelationIdUtils.CORRELATION_ID, correlationId);
                  logger.warn(message);
                } finally {
                  MDC.clear();
                }
              } else {
                logger.warn(message);
              }
              return Mono.empty();
            })
        .subscribe();
  }

  public void error(String message) {
    Mono.deferContextual(
            ctx -> {
              if (ctx.hasKey(CorrelationIdUtils.CORRELATION_ID)) {
                String correlationId = ctx.get(CorrelationIdUtils.CORRELATION_ID);
                try {
                  MDC.put(CorrelationIdUtils.CORRELATION_ID, correlationId);
                  logger.error(message);
                } finally {
                  MDC.clear();
                }
              } else {
                logger.error(message);
              }
              return Mono.empty();
            })
        .subscribe();
  }

  public void error(String message, Throwable throwable) {
    Mono.deferContextual(
            ctx -> {
              if (ctx.hasKey(CorrelationIdUtils.CORRELATION_ID)) {
                String correlationId = ctx.get(CorrelationIdUtils.CORRELATION_ID);
                try {
                  MDC.put(CorrelationIdUtils.CORRELATION_ID, correlationId);
                  logger.error(message, throwable);
                } finally {
                  MDC.clear();
                }
              } else {
                logger.error(message, throwable);
              }
              return Mono.empty();
            })
        .subscribe();
  }
}
