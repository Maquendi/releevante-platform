import {  cartItemSchema, cartSchema } from "@/config/drizzle/schemas/cart";
import { bookCopieSchema } from "@/config/drizzle/schemas/bookCopies";
import { Cart, CartId } from "../domain/models";
import { CartRepository } from "../domain/repositories";
import { ClientTransaction } from "@/lib/db/transaction-manager";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import {  eq } from "drizzle-orm";
import {  dbGetOne, dbPut, executeTransaction } from "@/lib/db/drizzle-client";

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
      cart_id: item.cart_id,
      qty: item.qty,
      book_copy_id: item.book_copy_id,
      is_available: item.bookCopy.is_available,
    }));

    return new Cart(cartId, userId, cartItems);
  }

 

  async updateCartState(cart: Cart): Promise<any> {
    return dbPut({
      table: "cartSchema",
      where: { id: cart.cartId.value },
      values: { state: cart.state },
    });
  }

  async update(cart: Cart): Promise<Cart> {
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
            })
            .where(eq(bookCopieSchema.id, book.book_copy_id));
        });

        const cartInsertion = tx
          .update(cartSchema)
          .set(cart_data)
          .where(eq(cartSchema.id, cart.cartId.value));

        const cartItemsInsertion = cart.cartItems.map((cartItem) => {
          return tx
            .insert(cartItemSchema)
            .values(cartItem)
            .onConflictDoUpdate({
              target: [cartItemSchema.cart_id, cartItemSchema.book_copy_id],
              set: { qty: cartItem.qty },
            });
        });

        await Promise.all([
          ...cartItemsInsertion,
          ...bookCopyUpdation,
          cartInsertion,
        ]);
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

    
        await tx.insert(cartSchema).values(cart_data);

      },
    };

    await executeTransaction(transaction);

    return cart;
  }
}

export const defaultCartRepository = new CartRepositoryImpl();
