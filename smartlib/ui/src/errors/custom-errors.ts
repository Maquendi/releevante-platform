import { BookTransaction } from "@/core/domain/loan.model";

export class MaxBookItemThresholdExceeded extends Error {
  currentLoan: BookTransaction[];
  constructor(currentLoan: BookTransaction[]) {
    super("book items exceeded");
    this.currentLoan = currentLoan;
  }
}
