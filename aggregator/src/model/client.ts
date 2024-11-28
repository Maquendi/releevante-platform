export interface BookImage {
  id: string;
  isbn: string;
  url: string;
  sourceUrl: string;
}

export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  language: string;
  price: number;
  correlationId: string;
  description: string;
  images: BookImage[];
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

export interface LibraryAccess {
  userId: string;
  accessId: string;
  accessDueDays: number;
  expiresAt: Date;
  credential: string;
  credentialType: string;
}