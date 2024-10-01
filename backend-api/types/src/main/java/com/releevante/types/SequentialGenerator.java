/* (C)2023 */
package com.releevante.types;

import java.util.Objects;
import java.util.Optional;
import java.util.function.Function;
import reactor.core.publisher.Mono;

public class SequentialGenerator<E> implements Generator<E> {
  Function<E, E> calculateNext;

  E zero;

  Optional<E> previous;

  Optional<E> current;

  SequentialGenerator() {}

  SequentialGenerator(E zero, Function<E, E> calculateNext) {
    Objects.requireNonNull(calculateNext, "calculateNext");
    Objects.requireNonNull(zero, "zero");
    Objects.requireNonNull(calculateNext.apply(zero), "calculateNext.apply(zero)");

    this.calculateNext = calculateNext;
    this.zero = zero;
    this.previous = Optional.empty();
    this.current = Optional.empty();
  }

  public static <E> Mono<SequentialGenerator<E>> fromZero(E zero, Function<E, E> calculateNext) {
    return Mono.fromCallable(() -> new SequentialGenerator<>(zero, calculateNext));
  }

  @Override
  public synchronized E next() {
    E nextValue = this.current.map(this.calculateNext).orElse(this.calculateNext.apply(this.zero));
    this.previous = this.current;
    this.current = Optional.of(nextValue);
    return nextValue;
  }
}
