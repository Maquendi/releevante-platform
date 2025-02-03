package com.releevante.core.application.dto;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.LibrarySetting;
import com.releevante.types.ImmutableObject;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = LibrarySettingsDto.class)
@JsonSerialize(as = LibrarySettingsDto.class)
@ImmutableObject
public abstract class AbstractLibrarySettingsDto extends AbstractPartialSettingDto {

  /** determines by how much the book price should drop in this library. defaults to 0 */
  abstract float bookPriceDiscountPercentage();

  /** determines by how much the book price should raise in this library. defaults to 0 */
  abstract float bookPriceSurchargePercentage();

  /** determines how many times a book should be borrowed for the price to be reduced. */
  abstract int bookPriceReductionThreshold();

  /** determines in percentage, how much of the price of the book should drop */
  abstract float bookPriceReductionRateOnThresholdReached();

  /** how many times a book should be used before enabling sales option */
  abstract int bookUsageCountBeforeEnablingSale();

  public LibrarySetting toDomain(
      SequentialGenerator<String> uuidGen, SequentialGenerator<ZonedDateTime> dateTimeGen) {
    return LibrarySetting.builder()
        .id(uuidGen.next())
        .slid(slid())
        .maxBooksPerLoan(this.maxBooksPerLoan())
        .sessionDurationMinutes(sessionDurationMinutes())
        .bookPriceDiscountPercentage(this.bookPriceDiscountPercentage())
        .bookPriceReductionThreshold(this.bookPriceReductionThreshold())
        .bookPriceSurchargePercentage(this.bookPriceSurchargePercentage())
        .bookPriceReductionRateOnThresholdReached(this.bookPriceReductionRateOnThresholdReached())
        .createdAt(dateTimeGen.next())
        .bookUsageCountBeforeEnablingSale(bookUsageCountBeforeEnablingSale())
        .isSync(false)
        .build();
  }
}
