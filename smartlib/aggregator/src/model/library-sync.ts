enum BookTransactionStatusEnum {
  RETURNED_ON_TIME,
  RETURNED_BEFORE_TIME,
  PARTIAL_RETURN,
  RETURNED_OVERDUE,
  CURRENT,
  OVERDUE,
}

enum TransactionItemStatusEnum {
  REPORTED_LOST,
  LOST,
  RETURNED,
  REPORTED_DAMAGE,
  DAMAGED,
  REPORTED_SOLD,
  SOLD,
  BORROWED,
}

export interface TransactionItemStatus {
  id: string;
  itemId: string;
  status: TransactionItemStatusEnum;
  createdAt: Date;
}

export interface TransactionStatus {
  id: string;
  transactionId: string;
  status: BookTransactionStatusEnum;
  createdAt: Date;
}

export interface TransactionItem {
  id: string;
  cpy: string;
}

export interface TransactionSyncDto {
  clientId: string;
  transactionId: string;
  createdAt: Date;
  items: TransactionItem[];
  transactionType: "RENT" | "PURCHASE";
}

export interface TransactionStatusSyncDto {
  clientId: string;
  transactionStatus: TransactionStatus[];
  transactionItemStatus: TransactionItemStatus[];
}

export interface TransactionStatusSyncResponse {
  success: boolean;
}

export interface TransactionSyncResponse {
  success: boolean;
}

// export interface ClientSyncDto {
//   id: string;
//   transactions?: TransactionDto[];
//   transactionStatus?: TransactionStatus[];
//   transactionItemStatus?: TransactionItemStatus[];
// }

// export interface LibrarySyncDto {
//   slid?: string;
//   clients: ClientSyncDto[];
// }

export interface LoanCreateResponse {
  id: string;
  exteralId: string;
}

// export interface ClientSyncReponse {
//   id: string;
//   loans: LoanCreateResponse[];
// }

// export interface LibrarySyncResponse {
//   id: string;
//   clients: ClientSyncDto[];
// }
