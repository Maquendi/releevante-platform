"use server";

import {
  bookTransactionServiceFacade,
  cartServiceFacade,
} from "@/core/application";
import { getAuthToken } from "./auth-actions";
import { LoanItemStatusDto, LoanStatusDto } from "@/core/application/dto";
import { CheckinItem } from "@/redux/features/returnbookSlice";
import {
  BookTransactionItemStatus,
  TransactionItemStatusEnum,
} from "@/core/domain/loan.model";

export const fetchUserBookLoans = async () => {
  try {
    const { userId } = await getAuthToken();
    return await bookTransactionServiceFacade.getUserLoans(userId!);
  } catch (error) {
    return [];
  }
};

export const returnSingleBook = async (loanItem: CheckinItem): Promise<any> => {
  try {
    return await cartServiceFacade.newLoanItemStatus({
      itemId: loanItem.id,
      status: TransactionItemStatusEnum.CHECKIN_SUCCESS,
    });
  } catch (error) {
    console.log("error return book" + error);
    throw new Error("error return book" + error);
  }
};

export const onNewItemStatus = async (
  status: LoanItemStatusDto
): Promise<BookTransactionItemStatus> => {
  try {
    return await cartServiceFacade.newLoanItemStatus(status);
  } catch (error) {
    console.log("error return book" + error);
    throw new Error("error return book" + error);
  }
};

export const onNewTransactionStatus = async (
  status: LoanStatusDto
): Promise<any> => {
  try {
    return await cartServiceFacade.newLoanStatus(status);
  } catch (error) {
    throw new Error("error return book" + error);
  }
};
