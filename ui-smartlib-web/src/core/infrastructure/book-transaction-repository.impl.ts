import {
  BookTransaction,
  BookTransactionItem,
  BookTransactionItemStatus,
  BookTransactions,
  BookTransactionStatus,
  TransactionItemStatusEnum,
  TransactionStatusEnum,
} from "../domain/loan.model";
import { BookTransactionRepository } from "../domain/repositories";
import { executeTransaction } from "@/lib/db/drizzle-client";
import { ClientTransaction } from "@/lib/db/transaction-manager";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { db } from "@/config/drizzle/db";
import { eq, and, inArray, not, sql } from "drizzle-orm";
import {
  bookSchema,
  bookCopieSchema,
  ftagsSchema,
  bookFtagSchema,
} from "@/config/drizzle/schemas";
import { UserId } from "@/identity/domain/models";
import { bookTransactionStatusSchema } from "@/config/drizzle/schemas/bookTransactionStatus";
import { bookTransactionItemStatusSchema } from "@/config/drizzle/schemas/bookTransactionItemStatus";
import { bookTransactionSchema } from "@/config/drizzle/schemas/bookTransaction";
import { bookTransactionItemSchema } from "@/config/drizzle/schemas/bookTransactionItem";
import { arrayGroupinBy } from "@/lib/utils";

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
        const transactions = Object.values(bookTransactions).flat();
        const transactionsInsertion = transactions.map(
          async (bookTransaction: BookTransaction) => {
            return await tx.insert(bookTransactionSchema).values({
              id: bookTransaction.id,
              clientId: bookTransaction.clientId.value,
              transactionType: bookTransaction.transactionType,
              returnsAt: bookTransaction?.returnsAt,
              createdAt: bookTransaction?.createdAt,
            });
          }
        );

        console.log(transactions);

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
          return t.status?.map(async (status: BookTransactionStatus) => {
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

    await db.transaction(async (tx) => {
      const data = await tx
        .insert(bookTransactionItemStatusSchema)
        .values({
          id: status.id,
          itemId: status.itemId,
          status: status.status,
          isSynced: false,
          created_at: status.createdAt,
        })
        .onConflictDoNothing({
          target: [
            bookTransactionItemStatusSchema.itemId,
            bookTransactionItemStatusSchema.status,
          ],
        });

      if (
        data.changes &&
        (status.status == TransactionItemStatusEnum.CHECKOUT_SUCCESS ||
          status.status == TransactionItemStatusEnum.CHECKIN_SUCCESS)
      ) {
        return tx
          .update(bookCopieSchema)
          .set({
            isAvailable:
              status.status == TransactionItemStatusEnum.CHECKIN_SUCCESS,
          })
          .where(eq(bookCopieSchema.id, status.cpy));
      }
    });

    return status;
  }

  async newTransactionStatus(
    status: BookTransactionStatus
  ): Promise<BookTransactionStatus> {
    console.log(status);

    await db.transaction(async (tx) => {
      if (status.status === TransactionStatusEnum.RETURNED) {
        // verify all items are properly returned, else throw an error
        const results = await tx
          .select({
            itemsReturned:
              sql<number>`count(${bookTransactionItemStatusSchema.id})`.mapWith(
                Number
              ),
            totalItems:
              sql<number>`count(${bookTransactionItemSchema.id})`.mapWith(
                Number
              ),
          })
          .from(bookTransactionItemStatusSchema)
          .innerJoin(
            bookTransactionItemSchema,
            eq(
              bookTransactionItemStatusSchema.itemId,
              bookTransactionItemSchema.id
            )
          )
          .where(
            and(
              eq(bookTransactionItemSchema.transactionId, status.transactionId),
              eq(
                bookTransactionItemStatusSchema.status,
                TransactionItemStatusEnum.CHECKIN_SUCCESS
              )
            )
          );

        console.log("results ************************************************");
        console.log(results);

        if (results.length) {
          const itemsReturned = results[0].itemsReturned;
          const totalItems = results[0].totalItems;

          if (itemsReturned < totalItems) {
            throw new Error("All transaction items must be returned.");
          }
        }
      }

      await tx
        .insert(bookTransactionStatusSchema)
        .values({
          id: status.id,
          transactionId: status.transactionId,
          status: status.status,
          isSynced: false,
          createdAt: status.createdAt,
        })
        .onConflictDoNothing({
          target: [
            bookTransactionStatusSchema.transactionId,
            bookTransactionStatusSchema.status,
          ],
        });
    });
    return status;
  }

  async getUserActiveTransactions(clientId: UserId): Promise<BookTransactions> {
    const returnedTransactions = (
      await db
        .select({
          transactionId: bookTransactionStatusSchema.transactionId,
        })
        .from(bookTransactionStatusSchema)
        .innerJoin(
          bookTransactionSchema,
          and(
            eq(
              bookTransactionSchema.id,
              bookTransactionStatusSchema.transactionId
            ),
            eq(bookTransactionSchema.clientId, clientId.value)
          )
        )
        .where(
          eq(bookTransactionStatusSchema.status, TransactionStatusEnum.RETURNED)
        )
    ).map((item) => item.transactionId);

    const activeTransactions = await db.query.bookTransactionSchema.findMany({
      where: and(
        eq(bookTransactionSchema.clientId, clientId.value),
        not(inArray(bookTransactionSchema.id, returnedTransactions))
      ),
      with: {
        items: {
          columns: {
            id: true,
          },
        },
      },
    });

    const transactionWithItems = activeTransactions.map(async (transaction) => {
      const returnedTransactionItems = (
        await db
          .select({
            itemId: bookTransactionItemStatusSchema.itemId,
          })
          .from(bookTransactionItemStatusSchema)
          .where(
            and(
              eq(
                bookTransactionItemStatusSchema.status,
                TransactionItemStatusEnum.CHECKIN_SUCCESS
              ),
              inArray(
                bookTransactionItemStatusSchema.itemId,
                transaction.items.map((item) => item.id)
              )
            )
          )
      ).map((item) => item.itemId);

      const items: BookTransactionItem[] = await db
        .select({
          id: bookTransactionItemSchema.id,
          isbn: bookSchema.id,
          position: bookCopieSchema.at_position,
          image: bookSchema.image,
          title: bookSchema.bookTitle,
          cpy: bookCopieSchema.id,
          author: bookSchema.author,
        })
        .from(bookTransactionItemSchema)
        .innerJoin(
          bookSchema,
          eq(bookSchema.id, bookTransactionItemSchema.isbn)
        )
        .innerJoin(
          bookCopieSchema,
          eq(bookCopieSchema.id, bookTransactionItemSchema.bookCopyId)
        )
        .where(
          and(
            eq(bookTransactionItemSchema.transactionId, transaction.id),
            not(inArray(bookTransactionItemSchema.id, returnedTransactionItems))
          )
        );

      const isbnSet = items.map((item) => item.isbn);

      const bookCategories = await db
        .select({
          isbn: bookFtagSchema.bookIsbn,
          en: ftagsSchema.enTagValue,
          fr: ftagsSchema.frTagValue,
          es: ftagsSchema.esTagValue,
          tagId: ftagsSchema.id,
        })
        .from(ftagsSchema)
        .innerJoin(
          bookFtagSchema,
          and(
            eq(bookFtagSchema.ftagId, ftagsSchema.id),
            inArray(bookFtagSchema.bookIsbn, isbnSet)
          )
        )
        .where(eq(ftagsSchema.tagName, "category"));

      const categoriesGroupByIsbn = arrayGroupinBy(bookCategories, "isbn");
      const itemWithCateogories = items.map((item) => {
        const categories = categoriesGroupByIsbn[item.isbn]?.map(
          ({ en, fr, es, tagId }) => ({
            en,
            fr,
            es,
            id: tagId,
          })
        );

        item.categories = categories;

        return item;
      });

      return {
        ...transaction,
        clientId: { value: transaction.clientId },
        items: itemWithCateogories,
        status: [],
      };
    });

    const activeUserTransactions = await Promise.all(transactionWithItems);

    const transactionsGrouped = arrayGroupinBy(
      activeUserTransactions,
      "transactionType"
    );

    const bookTransactions: BookTransactions = {
      rent: transactionsGrouped["RENT"] || [],
      purchase: transactionsGrouped["PURCHASE"] || [],
    };

    return bookTransactions;
  }

  async getUserTransactions(clientId: UserId): Promise<BookTransactions> {
    console.log("getUserLoans: " + clientId.value);
    return await this.getUserActiveTransactions(clientId);
  }
}

export const defaultBookTransactionRepositoryImpl =
  new BookTransactionRepositoryImpl();
