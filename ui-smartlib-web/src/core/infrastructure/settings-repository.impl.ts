import { dbGetOne } from "@/lib/db/drizzle-client";
import { SettingsRepository } from "../domain/repositories";
import { LibrarySettings } from "../domain/settings.model";
import { desc } from "drizzle-orm";
import { librarySettingsSchema } from "@/config/drizzle/schemas";

class SettingsRepositoryImpl implements SettingsRepository {
  async getSetting(): Promise<LibrarySettings> {
    const settings = (await dbGetOne("librarySettingsSchema", {
      orderBy: [desc(librarySettingsSchema.createdAt)],
      columns: {
        maxBooksPerLoan: true,
        bookPriceDiscountPercentage: true,
        bookPriceSurchargePercentage: true,
        bookPriceReductionThreshold: true,
        bookPriceReductionRateOnThresholdReached: true,
        sessionDurationMinutes: true,
        bookUsageCountBeforeEnablingSale: true,
      },
    })) as unknown;
    return settings as LibrarySettings;
  }
}

export const defaultSettingsRepository = new SettingsRepositoryImpl();
