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
  statuses: LoanItemStatus[];
}

export interface LoanSyncDto {
  id?: string;
  externalId: string;
  returnsAt?: Date;
  createdAt?: Date;
  status: LoanStatus[];
  items: LoanItem[];
}

export interface ClientSyncDto {
  id: string;
  loan: LoanSyncDto;
}

export interface LibrarySyncDto {
  slid: string;
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
  clients: ClientSyncReponse[];
}
