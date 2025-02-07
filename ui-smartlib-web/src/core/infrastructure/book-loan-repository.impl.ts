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
import { eq, and, or } from "drizzle-orm";
import { bookSchema, bookCopieSchema } from "@/config/drizzle/schemas";
import { UserId } from "@/identity/domain/models";
import { bookTransactionStatusSchema } from "@/config/drizzle/schemas/bookTransactionStatus";
import { bookTransactionItemStatusSchema } from "@/config/drizzle/schemas/bookTransactionItemStatus";
import { bookTransactionSchema } from "@/config/drizzle/schemas/bookTransaction";
import { bookTransactionItemSchema } from "@/config/drizzle/schemas/bookTransactionItem";
import { arrayGroupinBy } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

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
              createdAt: bookTransaction?.createdAt,
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
      created_at: status.createdAt,
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
      createdAt: status.createdAt,
    });

    return status;
  }

  async getUserLoans(clientId: UserId): Promise<BookTransaction[]> {
    console.log("getUserLoans: " + clientId.value);
    let bookTransactions = await db
      .select({
        id: bookTransactionSchema.id,
        clientId: bookTransactionSchema.clientId,
        transactionType: bookTransactionSchema.transactionType,
        createdAt: bookTransactionSchema.createdAt,
        returnsAt: bookTransactionSchema.returnsAt,
        status: bookTransactionStatusSchema.status,
      })
      .from(bookTransactionSchema)
      .innerJoin(
        bookTransactionStatusSchema,
        and(
          eq(
            bookTransactionStatusSchema.transactionId,
            bookTransactionSchema.id
          ),
          or(
            eq(bookTransactionStatusSchema.status, "CURRENT"),
            eq(bookTransactionStatusSchema.status, "RETURNED")
          )
        )
      )
      .where(
        and(
          eq(bookTransactionSchema.clientId, clientId.value),
          eq(bookTransactionSchema.transactionType, "RENT")
        )
      );

    const transactionsByStatus = arrayGroupinBy(bookTransactions, "id");

    bookTransactions = Object.entries<any[]>(transactionsByStatus)
      .filter((entry) => {
        const [, values] = entry;
        return !values.some((item) => item.status == "RETURNED");
      })
      .flatMap(([, values]) => values);

    const bookLoans = bookTransactions.map(async (transaction) => {
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
        .innerJoin(
          bookTransactionItemStatusSchema,
          and(
            eq(
              bookTransactionItemStatusSchema.itemId,
              bookTransactionItemSchema.id
            ),
            or(
              eq(bookTransactionItemStatusSchema.status, "CHECKOUT_SUCCESS"),
              eq(bookTransactionItemStatusSchema.status, "CHECKIN_SUCCESS")
            )
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

      const itemsGroupedById = arrayGroupinBy(bookTransactionItems, "id");

      const filteredTransactionItems = Object.entries<any[]>(itemsGroupedById)
        .filter((entry) => {
          const [, items] = entry;
          return !items.some((item) => item.status == "CHECKIN_SUCCESS");
        })
        .flatMap(([, items]) => items);

      if (!filteredTransactionItems.length) {
        await this.addLoanStatus({
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          status: "RETURNED",
          transactionId: transaction.id,
        });
      }

      return {
        ...transaction,
        clientId: { value: transaction.clientId },
        items: filteredTransactionItems,
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
