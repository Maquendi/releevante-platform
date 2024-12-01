package com.releevante.types;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import org.immutables.value.Value;

@Value.Immutable
@Retention(RetentionPolicy.CLASS)
@Value.Style(
    visibility = Value.Style.ImplementationVisibility.PUBLIC,
    builderVisibility = Value.Style.BuilderVisibility.PUBLIC,
    typeImmutable = "*",
    depluralize = true,
    redactedMask = "****")
public @interface ImmutableObject {}
