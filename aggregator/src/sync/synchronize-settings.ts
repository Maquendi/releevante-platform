import { dbConnection } from "../config/db";
import { executeGet } from "../htttp-client/http-client";
import { ApiRequest } from "../htttp-client/model";
import { LibrarySetting } from "../model/client";

const slid = process.env.slid;

export const synchronizeSettings = async (token: string) => {
  let syncComplete = false;
  let page = 0;
  let totalRecordsSynced = 0;

  const request: ApiRequest = {
    resource: `sl/${slid}/settings?status=not_synced`,
    token,
  };

  const response = await executeGet<LibrarySetting[]>(request);
  const settings = response.context.data;
  page++;
  syncComplete = settings?.length == 0 || !settings;

  if (settings && settings.length) {
    totalRecordsSynced += await insertSettings(settings);
  }

  console.log("TOTAL SETTINGS RECORDS SYNCHRONIZED: " + totalRecordsSynced);

  return totalRecordsSynced;
};

const insertSettings = async (settings: LibrarySetting[]) => {
  const stmt = dbConnection.prepare(
    "INSERT INTO library_settings VALUES (@id, @max_books_per_loan, @book_price_discount_percentage, @book_price_surcharge_percentage,  @book_price_reduction_threshold,  @book_price_reduction_rate_on_threshold_reached, @session_duration_minutes, @book_usage_count_before_enabling_sale, @created_at, @updated_at)"
  );

  let dbChanges = 0;

  settings
    .filter((item) => !item.isSync)
    .forEach((setting) => {
      try {
        dbChanges += stmt.run({
          id: setting.id,
          max_books_per_loan: setting.maxBooksPerLoan,
          book_price_discount_percentage: setting.bookPriceDiscountPercentage,
          book_price_surcharge_percentage: setting.bookPriceSurchargePercentage,
          book_price_reduction_threshold: setting.bookPriceReductionThreshold,
          book_price_reduction_rate_on_threshold_reached:
            setting.bookPriceReductionRateOnThresholdReached,

          session_duration_minutes: setting.sessionDurationMinutes,
          book_usage_count_before_enabling_sale:
            setting.bookUsageCountBeforeEnablingSale,
          created_at: setting.createdAt,
          updated_at: setting.createdAt
        }).changes;
      } catch (error) {
        return 0;
      }
    });

  return dbChanges;
};
