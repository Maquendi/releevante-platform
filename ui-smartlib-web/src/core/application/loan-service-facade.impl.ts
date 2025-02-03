import { UserId } from "@/identity/domain/models";
import { BookTransaction } from "../domain/loan.model";
import { BookLoanService } from "./service.definition";

export class LoanServiceFacade {
  constructor(private bookLoanService: BookLoanService) {}
  getUserLoans(clientId: UserId): Promise<BookTransaction[]> {
    return this.bookLoanService.getUserLoans(clientId);
  }
}
