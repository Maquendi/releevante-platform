package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = ClientDto.class)
@JsonSerialize(as = ClientDto.class)
@ImmutableExt
public abstract class AbstractClientDto {
  abstract String id();

  abstract List<CreateCartDto> carts();

  abstract List<BookReservationDto> reservations();
}
