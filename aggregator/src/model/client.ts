export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  language: string;
  price: number;
  correlationId: string;
  description: string;
  at_position?: string;
}

export interface LibrarySetting {
  id: string;
  maxBookPerLoan: number;
  bookPriceDiscountPercentage: number;
  bookPriceReductionThreshold: number;
  bookPriceSurchargePercentage: number;
  bookPriceReductionRateOnThresholdReached: number;
}

export interface ClientSyncResponse {
  books?: Book[];
  settings?: LibrarySetting[];
}
