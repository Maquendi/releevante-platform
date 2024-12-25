import {
  BookLoan,
  BookLoanItem,
  BookLoanItemStatus,
  BookLoanStatus,
} from "../domain/loan.model";
import { LoanRepository } from "../domain/repositories";
import { executeTransaction } from "@/lib/db/drizzle-client";
import { ClientTransaction } from "@/lib/db/transaction-manager";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { bookLoanSchema } from "@/config/drizzle/schemas/bookLoan";
import { loanItemSchema } from "@/config/drizzle/schemas/LoanItems";
import { loanStatusSchema } from "@/config/drizzle/schemas/LoanStatus";
import { db } from "@/config/drizzle/db";
import { loanItemStatusSchema } from "@/config/drizzle/schemas/LoanItemStatus";

export class BookLoanRepositoryImpl implements LoanRepository {
  async save(loan: BookLoan): Promise<void> {
    /**
     * transaction operation
     */

    const transaction: ClientTransaction = {
      execute: async function (
        tx: SQLiteTransaction<any, any, any, any>
      ): Promise<void> {
        const loanData = {
          id: loan.id,
          clientId: loan.clientId.value,
          returnsAt: loan.returnsAt.toISOString(),
          createdAt: loan.createdAt.toISOString(),
        } as any;

        const loanInsertion = await tx.insert(bookLoanSchema).values(loanData);

        const loanItemsInsertion = loan.loanItems.map((item) => {
          return tx.insert(loanItemSchema).values({
            isbn: item.isbn,
            id: item.id,
            bookCopyId: item.cpy,
            loanId: loan.id,
            createdAt: loan.createdAt.toISOString(),
            updatedAt: loan.createdAt.toISOString(),
          } as any);
        });

        const loanStatusInsertion = loan.status.map((status) => {
          return tx.insert(loanStatusSchema).values({
            id: status.id,
            loanId: status.loanId,
            isSynced: false,
            status: status.status.toString(),
            createdAt: status.createdAt.toISOString(),
          } as any);
        });

        await Promise.all([
          loanInsertion,
          ...loanItemsInsertion,
          ...loanStatusInsertion,
        ]);
      },
    };

    await executeTransaction(transaction);
  }

  async addLoanItemStatus(
    status: BookLoanItemStatus
  ): Promise<BookLoanItemStatus> {
    await db.insert(loanItemStatusSchema).values({
      id: status.id,
      itemId: status.itemId,
      status: status.status,
      isSynced: false,
      created_at: status.createdAt,
    } as any);

    return status;
  }

  async addLoanStatus(status: BookLoanStatus): Promise<BookLoanStatus> {
    await db.insert(loanStatusSchema).values({
      id: status.id,
      loanId: status.loanId,
      status: status.status,
      isSynced: false,
      created_at: status.createdAt,
    } as any);

    return status;
  }
}

export const defaultBookLoanRepositoryImpl = new BookLoanRepositoryImpl();
