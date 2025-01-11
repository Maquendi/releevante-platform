import {
  BookLoan,
  BookLoanItemStatus,
  BookLoanStatus,
  LoanGroup,
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
import {
  eq,
  sql,
  and,
  max,
} from "drizzle-orm";
import { jsonAgg } from "@/lib/db/helpers";
import {
  bookFtagSchema,
  bookSchema,
  ftagsSchema,
} from "@/config/drizzle/schemas";
import { UserId } from "@/identity/domain/models";

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
            status: status.status,
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


  async getUserLoanBooks(clientId: UserId): Promise<LoanGroup[]> {
    const lastLoanStatus = db
      .select({
        loanId: loanStatusSchema.loanId,
        status: loanStatusSchema.status,
        createdAt: max(loanStatusSchema.createdAt),
      })
      .from(loanStatusSchema)
      .groupBy(loanStatusSchema.loanId, loanStatusSchema.status)
      .having(
        sql`${loanStatusSchema.status} IN ('CURRENT', 'OVERDUE', 'PENDING')`
      )
      .as("lastLoanStatus");

    const data = await db
      .select({
        returnDate: bookLoanSchema.returnsAt,
        id: bookSchema.id,
        loanItemId: loanItemSchema.id,
        bookTitle: bookSchema.bookTitle,
        author: bookSchema.author,
        image: bookSchema.image,
        itemStatuses: jsonAgg({
          status: loanItemStatusSchema.status,
          createdAt: loanItemStatusSchema.created_at
        }).as('itemStatuses'),
        categories: {
          enCategory: ftagsSchema.enTagValue,
          frCategory: ftagsSchema.frTagValue,
          esCategory: ftagsSchema.esTagValue,
          isbn: bookFtagSchema.bookIsbn,
        },
      })
      .from(bookLoanSchema)
      .innerJoin(lastLoanStatus, eq(lastLoanStatus.loanId, bookLoanSchema.id))
      .leftJoin(loanItemSchema, eq(loanItemSchema.loanId, bookLoanSchema.id))
      .leftJoin(loanItemStatusSchema, eq(loanItemStatusSchema.itemId, loanItemSchema.id))
      .leftJoin(bookSchema, eq(loanItemSchema.isbn, bookSchema.id))
      .leftJoin(bookFtagSchema, eq(bookFtagSchema.bookIsbn, bookSchema.id))
      .leftJoin(
        ftagsSchema,
        and(
          eq(ftagsSchema.id, bookFtagSchema.ftagId),
          eq(ftagsSchema.tagName, "category")
        )
      )
      .where(eq(bookLoanSchema.clientId, clientId.value))
      .groupBy(loanItemSchema.id, bookFtagSchema.bookIsbn);

    const filteredData = data.filter(item => {
      if (!item.itemStatuses) return true;
      return !item.itemStatuses.some(item => item.status === 'RETURNED');

    });

    const groupedResults = Object.values(
      filteredData.reduce((acc, { returnDate, categories, itemStatuses, ...book }) => {
        if (!acc[returnDate]) {
          acc[returnDate] = { returnDate, books: [] };
        }
        acc[returnDate].books.push(book);
        return acc;
      }, {})
    );

    return (groupedResults.length > 0 ? groupedResults : []) as LoanGroup[];
}

}

export const defaultBookLoanRepositoryImpl = new BookLoanRepositoryImpl();
