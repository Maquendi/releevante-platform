export interface BookImage {
  id: string;
  isbn: string;
  url: string;
  sourceUrl: string;
}

export interface Tag {
  id: string;
  bookTagId: string;
  isbn: string;
  name: string;
  value: string;
  valueFr: string;
  valueSp: string;
  createdAt: Date;
}

export interface BookCopy {
  id: string;
  status: string;
  isbn: string;
  atPosition: string;
  isSync: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Book {
  isbn: string;
  title: string;
  author: string;
  language: string;
  price: number;
  correlationId: string;
  description: string;
  descriptionFr: string;
  descriptionSp: string;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
  images: BookImage[];
  copies: BookCopy[];
  publisher: string;
  printLength: number;
  publishDate: Date;
  dimensions: string;
  bindingType: string;
  publicIsbn?: string;
  rating: number;
  votes: number;
  qty: number;
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
