package com.releevante.core.domain;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LibrarySetting.class)
@JsonSerialize(as = LibrarySetting.class)
@ImmutableExt
public abstract class AbstractLibrarySetting {
  /** id of this setting. */
  abstract String id();

  /** the smart library id to which this setting belongs. */
  abstract String slid();

  /** determines how many books should be allowed to be borrowed in a single loan. defaults to 4 */
  abstract int maxBooksPerLoan();

  /** determines how the max duration of a user session for this library */
  abstract int sessionDurationMinutes();

  /** determines by how much the book price should drop in this library. defaults to 0 */
  abstract float bookPriceDiscountPercentage();

  /** determines by how much the book price should raise in this library. defaults to 0 */
  abstract float bookPriceSurchargePercentage();

  /** determines how many times a book should be borrowed for the price to be reduced. */
  abstract int bookPriceReductionThreshold();

  /** determines in percentage, how much of the price of the book should drop */
  abstract float bookPriceReductionRateOnThresholdReached();

  /** when this setting was created */
  abstract ZonedDateTime createdAt();

  /** if this setting is synced with the actual smart library it belongs to. */
  abstract boolean isSync();
}
