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
  slid: string;
  maxBooksPerLoan: number;
  sessionDurationMinutes: number;
  bookPriceDiscountPercentage: number;
  bookPriceReductionThreshold: number;
  bookPriceSurchargePercentage: number;
  bookPriceReductionRateOnThresholdReached: number;
  bookUsageCountBeforeEnablingSale: number;
  isSync: boolean;
  createdAt: Date;
}

interface UserCredential {
  key: string;
  value: string;
}

export interface LibraryAccess {
  id: string;
  orgId: string;
  slid: string;
  userId: string;
  accessDueDays: number;
  isActive: boolean;
  expiresAt: Date;
  isSync: boolean;
  createdAt: Date;
  credential: UserCredential;
  credentialType: string;
}

export interface ApiCredential {
  expiresAt: string;
  token: string;
  slid?: string;
}
