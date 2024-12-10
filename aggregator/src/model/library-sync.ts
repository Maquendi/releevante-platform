enum BookLoanStatusValues {
  RETURNED_ON_TIME,
  RETURNED_BEFORE_TIME,
  PARTIAL_RETURN,
  RETURNED_OVERDUE,
  CURRENT,
  OVERDUE,
}

enum LoanItemStatuses {
  REPORTED_LOST,
  LOST,
  RETURNED,
  REPORTED_DAMAGE,
  DAMAGED,
  REPORTED_SOLD,
  SOLD,
  BORROWED,
}

export interface LoanItemStatus {
  id: string;
  itemId: string;
  status: LoanItemStatuses;
  createdAt: Date;
}

export interface LoanStatus {
  id: string;
  status: BookLoanStatusValues;
  createdAt: Date;
}

export interface LoanItem {
  id: string;
  cpy: string;
  status: LoanItemStatus[];
}

export interface LoanSyncDto {
  id?: string;
  externalId: string;
  returnsAt: Date;
  createdAt: Date;
  updatedAt: Date;
  endTime: Date;
  status: LoanStatus[];
  items: LoanItem[];
}

export interface ClientSyncDto {
  id?: string;
  externalId: string;
  createdAt: Date;
  updatedAt: Date;
  loans: LoanSyncDto[];
}

export interface LibrarySyncDto {
  slid: string;
  clients: ClientSyncDto[];
}
