import {
  BookTransaction,
  BookTransactionItem,
  BookTransactionItemStatus,
  BookTransactions,
  BookTransactionStatus,
  TransactionItemStatusEnum,
  TransactionStatusEnum,
  TransactionType,
} from "../domain/loan.model";
import { BookTransactionRepository } from "../domain/repositories";
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
import { bookCopyStatusMapper } from "@/book/domain/models";

export class BookTransactionRepositoryImpl
  implements BookTransactionRepository
{
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
          async (bookTransaction: BookTransaction) => {
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
          return t.items.map(async (item: BookTransactionItem) => {
            return await tx.insert(bookTransactionItemSchema).values({
              isbn: item.isbn,
              id: item.id,
              bookCopyId: item.cpy,
              transactionId: t.id,
              createdAt: new Date().toISOString(),
            });
          });
        });

        const transactionStatusInsertion = transactions.map((t) => {
          return t.status.map(async (status: BookTransactionStatus) => {
            return await tx.insert(bookTransactionStatusSchema).values({
              id: status.id,
              transactionId: status.transactionId,
              isSynced: false,
              status: status.status,
              createdAt: status.createdAt,
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

  async newTransactionItemStatus(
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

    if (
      status.status == TransactionItemStatusEnum.CHECKOUT_SUCCESS ||
      status.status == TransactionItemStatusEnum.CHECKIN_SUCCESS
    ) {
      let calculateQty = (current: number) => current + 1;
      let calculateQtyForSale = (current: number) =>
        current == 0 ? current : current - 1;

      if (status.status == TransactionItemStatusEnum.CHECKOUT_SUCCESS) {
        calculateQty = (current: number) =>
          current == 0 ? current : current - 1;
        if (status.transactionType !== TransactionType.PURCHASE) {
          calculateQtyForSale = (current: number) => current;
        }
      }

      const bookSchemaUpdate = db
        .update(bookSchema)
        .set({
          qty: calculateQty(+bookSchema.qty),
          qty_for_sale: calculateQtyForSale(+bookSchema.qty_for_sale),
        })
        .where(eq(bookSchema.id, status.isbn));

      const bookCopySchemaUpdate = db
        .update(bookCopieSchema)
        .set({
          isAvailable:
            status.status == TransactionItemStatusEnum.CHECKIN_SUCCESS,
        })
        .where(eq(bookCopieSchema.id, status.cpy));

      await Promise.all([bookSchemaUpdate, bookCopySchemaUpdate]);
    }

    return status;
  }

  async newTransactionStatus(
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
            eq(
              bookTransactionStatusSchema.status,
              TransactionStatusEnum.CURRENT
            ),
            eq(
              bookTransactionStatusSchema.status,
              TransactionStatusEnum.RETURNED
            )
          )
        )
      )
      .where(
        and(
          eq(bookTransactionSchema.clientId, clientId.value),
          eq(bookTransactionSchema.transactionType, TransactionType.RENT)
        )
      );

    const transactionsByStatus = arrayGroupinBy(bookTransactions, "id");

    bookTransactions = Object.entries<any[]>(transactionsByStatus)
      .filter((entry) => {
        const [, values] = entry;
        return !values.some(
          (item) => item.status == TransactionStatusEnum.RETURNED
        );
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
              eq(
                bookTransactionItemStatusSchema.status,
                TransactionItemStatusEnum.CHECKOUT_SUCCESS
              ),
              eq(
                bookTransactionItemStatusSchema.status,
                TransactionItemStatusEnum.CHECKIN_SUCCESS
              )
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
          return !items.some(
            (item) => item.status == TransactionItemStatusEnum.CHECKIN_SUCCESS
          );
        })
        .flatMap(([, items]) => items);

      if (!filteredTransactionItems.length) {
        await this.newTransactionStatus({
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          status: TransactionStatusEnum.RETURNED,
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

export const defaultBookTransactionRepositoryImpl =
  new BookTransactionRepositoryImpl();
