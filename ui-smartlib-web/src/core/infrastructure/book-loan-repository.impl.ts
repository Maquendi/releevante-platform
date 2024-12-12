import { BookCopy } from "@/book/domain/models";
import { BookLoan } from "../domain/loan.model";
import { LoanRepository, TransactionCallback } from "../domain/repositories";
import { bookCopieSchema } from "@/config/drizzle/schemas";
import { executeTransaction } from "@/lib/db/drizzle-client";
import { ClientTransaction } from "@/lib/db/transaction-manager";
import { eq } from "drizzle-orm";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { bookLoanSchema } from "@/config/drizzle/schemas/bookLoan";
import { loanItemSchema } from "@/config/drizzle/schemas/LoanItems";

export class BookLoanRepositoryImpl implements LoanRepository {
  async save(
    loan: BookLoan,
    bookCopies: BookCopy[],
    transactionCb: TransactionCallback
  ): Promise<void> {
    /**
     * transaction operation
     */

    const transaction: ClientTransaction = {
      execute: async function (
        tx: SQLiteTransaction<any, any, any, any>
      ): Promise<void> {
        const loanData = {
          id: loan.id,
          cart_id: loan.cartId.value,
          user_id: loan.userId.value,
          status: loan.status,
          end_time: loan.endTime,
          start_time: loan.startTime,
          total_items: loan.itemsCount,
        } as any;

        const loanInsertion = await tx.insert(bookLoanSchema).values(loanData);

        const loanDetailInsertion = loan.details.map((detail) => {
          return tx.insert(loanItemSchema).values({
            isbn: detail.isbn,
            id: detail.id,
            bookCopyId: detail.book_copy_id,
            loanId: loan.id,
          });
        });

        const bookCopiesUpdation = bookCopies.map(async (copy) => {
          return tx
            .update(bookCopieSchema)
            .set({ is_available: false })
            .where(eq(bookCopieSchema.id, copy.id));
        });

        await Promise.all([
          loanInsertion,
          ...loanDetailInsertion,
          ...bookCopiesUpdation,
          transactionCb.execute(),
        ]);
      },
    };

    await executeTransaction(transaction);
  }
}

export const defaultBookLoanRepositoryImpl = new BookLoanRepositoryImpl();
