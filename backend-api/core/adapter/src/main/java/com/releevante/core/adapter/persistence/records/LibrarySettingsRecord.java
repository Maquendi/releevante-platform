package com.releevante.core.adapter.persistence.records;

import com.releevante.core.domain.LibrarySetting;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "library_settings", schema = "core")
@Getter
@Setter
@NoArgsConstructor
public class LibrarySettingsRecord extends SimplePersistable {
  /** id of this setting. */
  @Id String id;

  /** the smart library id to which this setting belongs. */
  String slid;

  /** determines how many books should be allowed to be borrowed in a single loan. defaults to 4 */
  int maxBooksPerLoan;

  /** determines by how much the book price should drop in this library. defaults to 0 */
  float bookPriceDiscountPercentage;

  /** determines by how much the book price should raise in this library. defaults to 0 */
  float bookPriceSurchargePercentage;

  /** determines how many times a book should be borrowed for the price to be reduced. */
  int bookPriceReductionThreshold;

  /** determines in percentage, how much of the price of the book should drop */
  float bookPriceReductionRateOnThresholdReached;

  /** determines how the max duration of a user session for this library */
  int sessionDurationMinutes;

  /** if this setting is synced with the actual smart library it belongs to. */
  boolean isSync;

  public LibrarySetting toDomain() {
    return LibrarySetting.builder()
        .id(id)
        .slid(slid)
        .maxBooksPerLoan(maxBooksPerLoan)
        .bookPriceDiscountPercentage(bookPriceDiscountPercentage)
        .bookPriceSurchargePercentage(bookPriceSurchargePercentage)
        .bookPriceReductionThreshold(bookPriceReductionThreshold)
        .bookPriceReductionRateOnThresholdReached(bookPriceReductionRateOnThresholdReached)
        .createdAt(createdAt)
        .sessionDurationMinutes(sessionDurationMinutes)
        .isSync(isSync)
        .build();
  }

  public static LibrarySettingsRecord from(LibrarySetting domain) {
    var record = new LibrarySettingsRecord();
    record.setId(domain.id());
    record.setNew(true);
    record.setSync(domain.isSync());
    record.setMaxBooksPerLoan(domain.maxBooksPerLoan());
    record.setBookPriceDiscountPercentage(domain.bookPriceDiscountPercentage());
    record.setBookPriceSurchargePercentage(domain.bookPriceSurchargePercentage());
    record.setBookPriceReductionThreshold(domain.bookPriceReductionThreshold());
    record.setBookPriceReductionRateOnThresholdReached(
        domain.bookPriceReductionRateOnThresholdReached());
    record.setCreatedAt(domain.createdAt());
    record.setSlid(domain.slid());
    record.setSessionDurationMinutes(domain.sessionDurationMinutes());

    return record;
  }
}
