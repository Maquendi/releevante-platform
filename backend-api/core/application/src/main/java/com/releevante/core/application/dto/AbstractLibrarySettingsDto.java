package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.LibrarySetting;
import com.releevante.types.ImmutableExt;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LibrarySettingsDto.class)
@JsonSerialize(as = LibrarySettingsDto.class)
@ImmutableExt
public abstract class AbstractLibrarySettingsDto {
  abstract String id();

  abstract Integer maxBookPerLoan();

  abstract float bookPriceDiscountPercentage();

  /** determines by how much the book price should raise in this library. defaults to 0 */
  abstract Float bookPriceSurchargePercentage();

  /** determines how many times a book should be borrowed for the price to be reduced. */
  abstract int bookPriceReductionThreshold();

  /** determines in percentage, how much of the price of the book should drop */
  abstract Float bookPriceReductionRateOnThresholdReached();

  /** when this setting was created */
  abstract ZonedDateTime createdAt();

  public static LibrarySettingsDto from(LibrarySetting setting) {
    return LibrarySettingsDto.builder()
        .id(setting.id())
        .maxBookPerLoan(setting.maxBooksPerLoan())
        .bookPriceDiscountPercentage(setting.bookPriceDiscountPercentage())
        .bookPriceReductionThreshold(setting.bookPriceReductionThreshold())
        .bookPriceSurchargePercentage(setting.bookPriceSurchargePercentage())
        .bookPriceReductionRateOnThresholdReached(
            setting.bookPriceReductionRateOnThresholdReached())
        .createdAt(setting.createdAt())
        .build();
  }
}
