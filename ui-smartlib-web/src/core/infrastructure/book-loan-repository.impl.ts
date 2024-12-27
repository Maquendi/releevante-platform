import {
  BookLoan,
  BookLoanItem,
  BookLoanItemStatus,
  BookLoanStatus,
  LoanGroup,
} from "../domain/loan.model";
import { LoanRepository } from "../domain/repositories";
import { dbGetAll, executeTransaction } from "@/lib/db/drizzle-client";
import { ClientTransaction } from "@/lib/db/transaction-manager";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { bookLoanSchema } from "@/config/drizzle/schemas/bookLoan";
import { loanItemSchema } from "@/config/drizzle/schemas/LoanItems";
import { loanStatusSchema } from "@/config/drizzle/schemas/LoanStatus";
import { db } from "@/config/drizzle/db";
import { loanItemStatusSchema } from "@/config/drizzle/schemas/LoanItemStatus";
import { eq, gt, inArray, or, sql, and } from "drizzle-orm";
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

  async getUserLoanBooks(clientId: UserId): Promise<LoanGroup> {
    const lastStatus = db.$with("LastStatus").as(
      db
        .select({
          loanId: loanStatusSchema.loanId,
          status: loanStatusSchema.status,
          rowNum:
            sql`ROW_NUMBER() OVER (PARTITION BY ${loanStatusSchema.loanId} ORDER BY ${loanStatusSchema.createdAt} DESC)`.as(
              "rn"
            ),
        })
        .from(loanStatusSchema)
    );

    const data = await db
      .with(lastStatus)
      .select({
        returnDate: bookLoanSchema.returnsAt,
        id: bookSchema.id,
        bookTitle: bookSchema.bookTitle,
        author: bookSchema.author,
        image:bookSchema.image,
        categories: jsonAgg({
          enCategory: ftagsSchema.enTagValue,
          frCategory: ftagsSchema.frTagValue,
          esCategory: ftagsSchema.esTagValue,
          isbn: bookFtagSchema.bookIsbn,
        }),
      })
      .from(bookLoanSchema)
      .innerJoin(
        lastStatus,
        and(eq(lastStatus.loanId, bookLoanSchema.id), eq(lastStatus.rowNum, 1))
      )
      .leftJoin(loanItemSchema, eq(loanItemSchema.loanId, bookLoanSchema.id))
      .leftJoin(bookSchema, eq(loanItemSchema.isbn, bookSchema.id))
      .leftJoin(bookFtagSchema, eq(bookFtagSchema.bookIsbn, bookSchema.id))
      .leftJoin(
        ftagsSchema,
        and(
          eq(ftagsSchema.id, bookFtagSchema.ftagId),
          eq(ftagsSchema.tagName, "category")
        )
      )
      .where(
        and(
          eq(bookLoanSchema.clientId, clientId.value),
          inArray(lastStatus.status, ["CURRENT", "OVERDUE", "PENDING"])
        )
      )
      .groupBy(bookLoanSchema.id, bookSchema.id);

    const groupedResults =   Object.values(data.reduce((acc, { returnDate, ...book }) => {
      if (!acc[returnDate]) {
        acc[returnDate] = { returnDate, books: [] };
      }
      acc[returnDate].books.push(book);
      return acc;
    }, {}))

    const result = groupedResults.length > 0 ? groupedResults[0]:[]
    return result  as LoanGroup

  }
}

export const defaultBookLoanRepositoryImpl = new BookLoanRepositoryImpl();
