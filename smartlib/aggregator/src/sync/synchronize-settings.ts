import { dbConnection } from "../config/db";
import {
  executeGet,
  executePatch,
  executePut,
} from "../htttp-client/http-client";
import { ApiRequest } from "../htttp-client/model";
import { LibrarySetting } from "../model/client";
import logger from "../logger";

const slid = process.env.slid;

export const synchronizeSettings = async (token: string) => {
  logger.info('Starting library settings synchronization');

  let totalRecordsSynced = 0;
  let completedNoError = false;

  const request: ApiRequest = {
    resource: `sl/${slid}/settings?status=not_synced`,
    token,
  };

  logger.debug('Fetching library settings from server');
  const response = await executeGet<LibrarySetting[]>(request);
  const settings = response.context.data || [];

  logger.debug('Received library settings data', { count: settings.length });

  if (settings.length) {
    try {
      logger.debug('Inserting settings records');
      totalRecordsSynced += await insertSettings(settings);
      completedNoError = true;
    } catch (error) {
      logger.error('Error inserting settings records', { 
        error: error instanceof Error ? error.message : String(error) 
      });
      completedNoError = false;
    }
  } else {
    logger.debug('No library settings to synchronize');
  }

  logger.info('Library settings synchronization completed', { totalRecordsSynced });

  if (completedNoError) {
    logger.debug('Updating library settings synchronization status');
    const request: ApiRequest = {
      token,
      resource: `sl/${slid}/settings`,
    };
    const response = await executePut<Boolean>(request);

    logger.info('Library settings set synchronized', { 
      success: response?.context?.data 
    });
  }

  return totalRecordsSynced;
};

const insertSettings = async (settings: LibrarySetting[]) => {
  logger.debug('Preparing database statements for settings insertion');

  const create_stmt = dbConnection.prepare(
    "INSERT INTO library_settings (id, max_books_per_loan, book_price_discount_percentage, book_price_surcharge_percentage, book_price_reduction_threshold, session_duration_minutes,  book_usage_count_before_enabling_sale, book_price_reduction_rate_on_threshold_reached, created_at, updated_at) VALUES (@id, @max_books_per_loan, @book_price_discount_percentage, @book_price_surcharge_percentage,  @book_price_reduction_threshold, @session_duration_minutes,  @book_usage_count_before_enabling_sale, @book_price_reduction_rate_on_threshold_reached, @created_at, @updated_at)"
  );

  const update_stmt = dbConnection.prepare(
    "UPDATE library_settings SET max_books_per_loan=?, book_price_discount_percentage=?, book_price_surcharge_percentage=?,  book_price_reduction_threshold=?, session_duration_minutes=?,  book_usage_count_before_enabling_sale=?, book_price_reduction_rate_on_threshold_reached=?, updated_at=? WHERE id=?"
  );

  let dbChanges = 0;
  let insertCount = 0;
  let updateCount = 0;

  const filteredSettings = settings.filter((item) => !item.isSync);
  logger.debug('Processing settings records', { 
    totalCount: settings.length,
    filteredCount: filteredSettings.length 
  });

  filteredSettings.forEach((setting) => {
    try {
      dbChanges += create_stmt.run({
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
        updated_at: setting.createdAt,
      }).changes;
      insertCount++;
    } catch (error: any) {
      logger.debug('Record already exists, updating instead', { 
        settingId: setting.id,
        error: error.message 
      });

      dbChanges += update_stmt.run(
        setting.maxBooksPerLoan,
        setting.bookPriceDiscountPercentage,
        setting.bookPriceSurchargePercentage,
        setting.bookPriceReductionThreshold,
        setting.sessionDurationMinutes,
        setting.bookUsageCountBeforeEnablingSale,
        setting.bookPriceReductionRateOnThresholdReached,
        new Date().toDateString(),
        setting.id
      ).changes;
      updateCount++;
    }
  });

  logger.debug('Settings records processing completed', { 
    inserted: insertCount,
    updated: updateCount,
    totalChanges: dbChanges
  });

  return dbChanges;
};
