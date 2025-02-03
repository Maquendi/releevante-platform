import {
  BookTransaction,
  BookTransactionItemStatus,
  BookTransactions,
  BookTransactionStatus,
} from "../domain/loan.model";
import { LoanRepository } from "../domain/repositories";
import { executeTransaction } from "@/lib/db/drizzle-client";
import { ClientTransaction } from "@/lib/db/transaction-manager";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { db } from "@/config/drizzle/db";
import { eq, and } from "drizzle-orm";
import { bookSchema, bookCopieSchema } from "@/config/drizzle/schemas";
import { UserId } from "@/identity/domain/models";
import { bookTransactionStatusSchema } from "@/config/drizzle/schemas/bookTransactionStatus";
import { bookTransactionItemStatusSchema } from "@/config/drizzle/schemas/bookTransactionItemStatus";
import { bookTransactionSchema } from "@/config/drizzle/schemas/bookTransaction";
import { bookTransactionItemSchema } from "@/config/drizzle/schemas/bookTransactionItem";

export class BookLoanRepositoryImpl implements LoanRepository {
  async save(bookTransactions: BookTransactions): Promise<void> {
    /**
     * transaction operation
     */
    const transaction: ClientTransaction = {
      execute: async function (
        tx: SQLiteTransaction<any, any, any, any>
      ): Promise<void> {
        const transactions = Object.values(bookTransactions);
        const transactionsInsertion = transactions.map(
          async (bookTransaction) => {
            const transactionData = {
              id: bookTransaction.id,
              clientId: bookTransaction.clientId.value,
              transactionType: bookTransaction.transactionType,
              returnsAt: bookTransaction?.returnsAt,
            };

            return await tx
              .insert(bookTransactionSchema)
              .values(transactionData);
          }
        );

        const transactionItemsInsertion = transactions.map((t) => {
          return t.items.map(async (item) => {
            return await tx.insert(bookTransactionItemSchema).values({
              isbn: item.isbn,
              id: item.id,
              bookCopyId: item.cpy,
              transactionId: t.id,
            });
          });
        });

        const transactionStatusInsertion = transactions.map((t) => {
          return t.status.map(async (status) => {
            return await tx.insert(bookTransactionStatusSchema).values({
              id: status.id,
              transactionId: status.transactionId,
              isSynced: false,
              status: status.status,
            });
          });
        });

        await Promise.all([
          ...transactionsInsertion,
          ...transactionItemsInsertion,
          ...transactionStatusInsertion,
        ]);
      },
    };

    await executeTransaction(transaction);
  }

  async addLoanItemStatus(
    status: BookTransactionItemStatus
  ): Promise<BookTransactionItemStatus> {
    console.log(status);

    await db.insert(bookTransactionItemStatusSchema).values({
      id: status.id,
      itemId: status.itemId,
      status: status.status,
      isSynced: false,
    });

    return status;
  }

  async addLoanStatus(
    status: BookTransactionStatus
  ): Promise<BookTransactionStatus> {
    console.log(status);
    await db.insert(bookTransactionStatusSchema).values({
      id: status.id,
      transactionId: status.transactionId,
      status: status.status,
      isSynced: false,
    });

    return status;
  }

  async getUserLoans(clientId: UserId): Promise<BookTransaction[]> {
    console.log("getUserLoans: " + clientId.value);
    const bookTransaction = await db
      .select({
        id: bookTransactionSchema.id,
        clientId: bookTransactionSchema.clientId,
        transactionType: bookTransactionSchema.transactionType,
        createdAt: bookTransactionSchema.createdAt,
        returnsAt: bookTransactionSchema.returnsAt,
      })
      .from(bookTransactionSchema)
      .innerJoin(
        bookTransactionStatusSchema,
        and(
          eq(
            bookTransactionStatusSchema.transactionId,
            bookTransactionSchema.id
          ),
          eq(bookTransactionStatusSchema.status, "CURRENT")
        )
      )
      .where(
        and(
          eq(bookTransactionSchema.clientId, clientId.value),
          eq(bookTransactionSchema.transactionType, "RENT")
        )
      );

    const bookLoans = bookTransaction.map(async (transaction) => {
      const bookTransactionStatus = await db
        .select({
          id: bookTransactionStatusSchema.id,
          transactionId: bookTransactionStatusSchema.transactionId,
          status: bookTransactionStatusSchema.status,
        })
        .from(bookTransactionStatusSchema)
        .where(eq(bookTransactionStatusSchema.transactionId, transaction.id));

      const bookTransactionItems = await db
        .select({
          id: bookTransactionItemSchema.id,
          isbn: bookTransactionItemSchema.isbn,
          cpy: bookTransactionItemSchema.bookCopyId,
          position: bookCopieSchema.at_position,
          image: bookSchema.image,
          title: bookSchema.bookTitle,
          status: bookTransactionItemStatusSchema.status,
        })
        .from(bookTransactionItemSchema)
        .leftJoin(
          bookTransactionItemStatusSchema,
          and(
            eq(
              bookTransactionItemStatusSchema.itemId,
              bookTransactionItemSchema.id
            ),
            eq(bookTransactionItemStatusSchema.status, "CHECKIN_SUCCESS")
          )
        )
        .innerJoin(
          bookCopieSchema,
          eq(bookCopieSchema.id, bookTransactionItemSchema.bookCopyId)
        )
        .innerJoin(
          bookSchema,
          eq(bookSchema.id, bookTransactionItemSchema.isbn)
        )
        .where(eq(bookTransactionItemSchema.transactionId, transaction.id));

      return {
        ...transaction,
        clientId: { value: transaction.clientId },
        items: bookTransactionItems.filter(
          (item) => item.status !== "CHECKIN_SUCCESS"
        ),
        status: bookTransactionStatus,
      } as any;
    });

    const bookLoanTransactions = await Promise.all(bookLoans);

    return bookLoanTransactions.filter(
      (transaction) => transaction.items.length > 0
    );
  }
}

export const defaultBookLoanRepositoryImpl = new BookLoanRepositoryImpl();
