package com.releevante.core.application.dto.clients.reservations;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.util.List;
import org.immutables.value.Value;

@Value.Immutable()
@ImmutableExt
@JsonDeserialize(as = RemoveReservationItemsDto.class)
@JsonSerialize(as = RemoveReservationItemsDto.class)
public abstract class AbstractRemoveReservationItemsDto {
  abstract String reservationId();

  abstract List<String> itemsIds();
}
