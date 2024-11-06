import { UserId } from "@/identity/domain/models";
import { CartId } from "./cart.model";

export interface BookLoanDetail {
  id: string;
  isbn: string;
  book_copy_id: string;
}

export interface BookLoan {
  id: string;
  userId: UserId;
  cartId: CartId;
  itemsCount: number;
  status: "onschedule" | "late";
  details: BookLoanDetail[];
  startTime?: Date;
  endTime?: Date;
}
