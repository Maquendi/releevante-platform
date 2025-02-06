enum BookTransactionStatusValues {
  RETURNED_ON_TIME,
  RETURNED_BEFORE_TIME,
  PARTIAL_RETURN,
  RETURNED_OVERDUE,
  CURRENT,
  OVERDUE,
}

enum TransactionItemStatuses {
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
  status: TransactionItemStatuses;
  createdAt: Date;
}

export interface TransactionStatus {
  id: string;
  status: BookTransactionStatusValues;
  createdAt: Date;
}

export interface TransactionItem {
  id: string;
  cpy: string;
  statuses: TransactionItemStatus[];
}

export interface TransactionDto {
  id: string;
  externalId?: string;
  createdAt: Date;
  status: TransactionStatus[];
  items: TransactionItem[];
}

export interface ClientSyncDto {
  id: string;
  transactions?: TransactionDto[];
  transactionStatus?: TransactionStatus[];
  transactionItemStatus?: TransactionItemStatus[];
}

export interface LibrarySyncDto {
  slid?: string;
  clients: ClientSyncDto[];
}

export interface LoanCreateResponse {
  id: string;
  exteralId: string;
}

export interface ClientSyncReponse {
  id: string;
  loans: LoanCreateResponse[];
}

export interface LibrarySyncResponse {
  id: string;
  clients: ClientSyncDto[];
}
