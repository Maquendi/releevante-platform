package com.releevante.types;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import org.immutables.value.Value;

@Retention(RetentionPolicy.CLASS)
@Value.Style(
    visibility = Value.Style.ImplementationVisibility.PUBLIC,
    typeImmutable = "*",
    depluralize = true,
    defaults = @Value.Immutable(builder = false),
    redactedMask = "****")
public @interface ImmutableObjectNoBuilder {}
