package com.releevante.core.application.dto.sl.settings;

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
public abstract class AbstractLibrarySettingsDto {

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

  /** the smart library id to which this setting belongs. */
  abstract String slid();

  /** determines how many books should be allowed to be borrowed in a single loan. defaults to 4 */
  abstract int maxBooksPerLoan();

  /** determines how the max duration of a user session for this library */
  abstract int sessionDurationMinutes();

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

  public LibrarySetting patch(
      LibrarySetting setting,
      SequentialGenerator<String> uuidGenerator,
      SequentialGenerator<ZonedDateTime> dateTimeGenerator) {
    return LibrarySetting.builder()
        .id(uuidGenerator.next())
        .slid(slid())
        .isSync(false)
        .createdAt(dateTimeGenerator.next())
        .maxBooksPerLoan(maxBooksPerLoan())
        .sessionDurationMinutes(sessionDurationMinutes())
        .bookPriceReductionThreshold(setting.bookPriceReductionThreshold())
        .bookPriceDiscountPercentage(setting.bookPriceDiscountPercentage())
        .bookPriceSurchargePercentage(setting.bookPriceSurchargePercentage())
        .bookPriceReductionRateOnThresholdReached(
            setting.bookPriceReductionRateOnThresholdReached())
        .build();
  }
}
