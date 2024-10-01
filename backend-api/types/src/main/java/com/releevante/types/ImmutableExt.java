/* (C)2024 */
package com.releevante.types;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.immutables.value.Value;

@Target({ElementType.PACKAGE, ElementType.TYPE})
@Retention(RetentionPolicy.CLASS)
@Value.Style(
    visibility = Value.Style.ImplementationVisibility.PUBLIC,
    builderVisibility = Value.Style.BuilderVisibility.PUBLIC,
    typeImmutable = "*",
    depluralize = true,
    redactedMask = "****")
public @interface ImmutableExt {}
