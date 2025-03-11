export interface LibrarySettings {
    maxBooksPerLoan: number;
    bookPriceDiscountPercentage: number;
    bookPriceSurchargePercentage: number;
    bookPriceReductionThreshold: number;
    bookPriceReductionRateOnThresholdReached: number;
    sessionDurationMinutes: number;
    bookUsageCountBeforeEnablingSale: number;
    }