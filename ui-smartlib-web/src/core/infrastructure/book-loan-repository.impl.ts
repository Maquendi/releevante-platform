import { BookCopy } from "@/book/domain/models";
import { BookLoan } from "../domain/loan.model";
import { LoanRepository, TransactionCallback } from "../domain/repositories";
import { bookCopieSchema } from "@/config/drizzle/schemas";
import { executeTransaction } from "@/lib/db/drizzle-client";
import { ClientTransaction } from "@/lib/db/transaction-manager";
import { eq } from "drizzle-orm";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import {
  bookLoanDetailSchema,
  bookLoanSchema,
} from "@/config/drizzle/schemas/bookLoan";

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
<<<<<<< HEAD
        
        const loanInsertion = tx.insert(bookLoanSchema).values(loanData)
=======

        const loanInsertion = tx.insert(bookLoanSchema).values(loanData);
>>>>>>> 47a6767cd4cf766e210630d935485abe6c0cfde6

        const loanDetailInsertion = loan.details.map((detail) => {
          return tx.insert(bookLoanDetailSchema).values({
            isbn: detail.isbn,
            id: detail.id,
            book_copy_id: detail.book_copy_id,
            book_loan_id: loan.id,
          });
        });

<<<<<<< HEAD

=======
>>>>>>> 47a6767cd4cf766e210630d935485abe6c0cfde6
        const bookCopiesUpdation = bookCopies.map(async (copy) => {
          return tx
            .update(bookCopieSchema)
            .set({ is_available: false })
            .where(eq(bookCopieSchema.id, copy.id));
        });

        await Promise.all([
<<<<<<< HEAD
          loanInsertion,
          ...loanDetailInsertion,
=======
          ...loanDetailInsertion,
          loanInsertion,
>>>>>>> 47a6767cd4cf766e210630d935485abe6c0cfde6
          ...bookCopiesUpdation,
          transactionCb.execute(),
        ]);
      },
    };

    await executeTransaction(transaction);
  }
}

export const defaultBookLoanRepositoryImpl = new BookLoanRepositoryImpl();
