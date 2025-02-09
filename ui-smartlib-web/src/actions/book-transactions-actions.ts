"use server";

import {
  bookTransactionServiceFacade,
} from "@/core/application";
import { getAuthToken } from "./auth-actions";
import {
  BookTransactionItemStatus,
} from "@/core/domain/loan.model";
import { TransactionItemStatusDto, TransactionStatusDto } from "@/core/application/service.definition";

export const fetchUserBookLoans = async () => {
  try {
    const { userId } = await getAuthToken();
    return await bookTransactionServiceFacade.getUserLoans(userId!);
  } catch (error) {
    return [];
  }
};

export const onNewItemStatus = async (status: TransactionItemStatusDto): Promise<BookTransactionItemStatus> => {
  try {
    return await bookTransactionServiceFacade.newTransactionItemStatus(status);
  } catch (error) {
    console.log("error return book" + error);
    throw new Error("error return book" + error);
  }
};

export const onNewTransactionStatus = async (
  status: TransactionStatusDto
): Promise<any> => {
  try {
    return await bookTransactionServiceFacade.newTransactionStatus(status);
  } catch (error) {
    throw new Error("error return book" + error);
  }
};
