package com.releevante.types;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = BookCopyId.class)
@JsonSerialize(as = BookCopyId.class)
@ImmutableExt
public abstract class AbstractBookCopyId extends PrimitiveVo<String> {}
