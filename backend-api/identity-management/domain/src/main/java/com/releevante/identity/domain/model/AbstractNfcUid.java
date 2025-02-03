package com.releevante.identity.domain.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import com.releevante.types.PrimitiveVo;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = NfcUid.class)
@JsonSerialize(as = NfcUid.class)
@ImmutableExt
public abstract class AbstractNfcUid extends PrimitiveVo<String> {}
