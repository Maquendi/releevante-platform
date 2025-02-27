package com.releevante.core.application.dto.sl.settings;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.releevante.core.domain.LibrarySetting;
import com.releevante.types.ImmutableObject;
import com.releevante.types.SequentialGenerator;
import java.time.ZonedDateTime;
import org.immutables.value.Value;

@Value.Immutable()
@JsonDeserialize(as = PartialSettingDto.class)
@JsonSerialize(as = PartialSettingDto.class)
@ImmutableObject
public abstract class AbstractPartialSettingDto {
  /** the smart library id to which this setting belongs. */
  abstract String slid();

  /** determines how many books should be allowed to be borrowed in a single loan. defaults to 4 */
  abstract int maxBooksPerLoan();

  /** determines how the max duration of a user session for this library */
  abstract int sessionDurationMinutes();

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
