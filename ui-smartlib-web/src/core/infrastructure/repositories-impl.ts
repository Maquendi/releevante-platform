import { cartSchema } from "@/config/drizzle/schemas/cart";
import { bookCopieSchema } from "@/config/drizzle/schemas/book_copies";
import { Cart, CartId } from "../domain/models";
import { CartRepository } from "../domain/repositories";
import { ClientTransaction } from "@/lib/db/transaction-manager";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { eq } from "drizzle-orm";
import { dbGetOne, executeTransaction } from "@/lib/db/drizzle-client";
import { BookCopy } from "@/book/domain/models";

class CartRepositoryImpl implements CartRepository {
  async find(cartId: CartId): Promise<Cart> {
    const cartData = await dbGetOne("cartSchema", {
      with: {
        items: {
          with: {
            bookCopy: {
              columns: {
                id: true,
                status: true,
                is_available: true,
              },
            },
          },
        },
      },
      where: eq(cartSchema.id, cartId.value),
    });

    const userId = { value: cartData.user_id };
    const cartItems = cartData.items.map((item) => ({
      bookCopy: item.bookCopy as BookCopy,
      qty: item.qty,
    }));

    return new Cart(cartId, userId, cartItems);
  }

  async update(cart: Cart, extras: () => Promise<Cart>): Promise<Cart> {
    /**
     * transaction operation
     */

    const transaction: ClientTransaction = {
      execute: async function (
        tx: SQLiteTransaction<any, any, any, any>
      ): Promise<void> {
        const cart_data = {
          id: cart.cartId.value,
          user_id: cart.userId.value,
          state: cart.state,
        } as any;

        const bookCopyUpdation = cart.cartItems.map(async (book) => {
          return tx
            .update(bookCopieSchema)
            .set({
              is_available: book.is_available,
              status: book.status,
            })
            .where(eq(bookCopieSchema.id, book.id));
        });

        const cartInsertion = tx
          .update(cartSchema)
          .set(cart_data)
          .where(eq(cartSchema.id, cart.cartId.value));

        await Promise.all([...bookCopyUpdation, cartInsertion, extras()]);
      },
    };

    await executeTransaction(transaction);

    return cart;
  }

  async save(cart: Cart): Promise<Cart> {
    const transaction: ClientTransaction = {
      execute: async function (
        tx: SQLiteTransaction<any, any, any, any>
      ): Promise<void> {
        const cart_data = {
          id: cart.cartId.value,
          user_id: cart.userId.value,
          state: cart.state,
        } as any;

        const bookCopyUpdation = cart.cartItems.map(async (book) => {
          return tx
            .update(bookCopieSchema)
            .set({
              is_available: book.is_available,
              status: book.status,
            })
            .where(eq(bookCopieSchema.id, book.id));
        });

        const cartInsertion = tx.insert(cartSchema).values(cart_data);

        await Promise.all([...bookCopyUpdation, cartInsertion]);
      },
    };

    await executeTransaction(transaction);

    return cart;
  }
}

export const defaultCartRepository = new CartRepositoryImpl();
