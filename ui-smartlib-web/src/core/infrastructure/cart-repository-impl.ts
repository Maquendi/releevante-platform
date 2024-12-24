import { cartItemSchema, cartSchema } from "@/config/drizzle/schemas/cart";
import { Cart, CartId, CartItem } from "../domain/cart.model";
import { CartRepository } from "../domain/repositories";
import { ClientTransaction } from "@/lib/db/transaction-manager";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { eq } from "drizzle-orm";
import { dbGetOne,  executeTransaction } from "@/lib/db/drizzle-client";

class CartRepositoryImpl implements CartRepository {
  async find(cartId: CartId): Promise<Cart> {
    const data = await dbGetOne("cartSchema", {
      with: {
        items: {
          columns: {
            id: true,
            qty: true,
            isbn: true,
            transactionType:true
          },
        },
      },
      where: eq(cartSchema.id, cartId.value),
    });

    const userId = { value: data.user_id };
    const cartItems: CartItem[] = data.items.map((item) => ({
      id: item.id,
      isbn: item.isbn,
      qty: item.qty,
      transactionType:item.transactionType
    }));

    return new Cart(cartId, userId, cartItems);
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
          state: cart.state,
        } as any;

        const cartUpdation = tx
          .update(cartSchema)
          .set(cart_data)
          .where(eq(cartSchema.id, cart.id.value));

        const cartItemsInsertion = cart.cartItems.map((cartItem) => {
          return tx
            .insert(cartItemSchema)
            .values({
              cartId: cart.id.value,
              isbn: cartItem.isbn,
              qty: cartItem.qty,
              id: cartItem.id,
              transactionType:cartItem.transactionType
            })
            .onConflictDoUpdate({
              target: [cartItemSchema.id, cartItemSchema.cartId],
              set: { qty: cartItem.qty },
            });
        });

        await Promise.all([...cartItemsInsertion, cartUpdation]);
      },
    };

    await executeTransaction(transaction);

    return cart;
  }

  async save(cart: Cart): Promise<Cart> {

    console.log("SAVING RECORDS " + JSON.stringify(cart))

    const transaction: ClientTransaction = {
      execute: async function (
        tx: SQLiteTransaction<any, any, any, any>
      ): Promise<void> {
        const cartData = {
          id: cart.id.value,
          user_id: cart.userId.value,
          state: cart.state,
        };

        const cartInsertion = tx.insert(cartSchema).values(cartData);

        const cartItemsInsertion = cart.cartItems.map((cartItem) => {
          return tx.insert(cartItemSchema).values({
            cartId: cart.id.value,
            isbn: cartItem.isbn,
            qty: cartItem.qty,
            id: cartItem.id,
            transactionType: cartItem.transactionType
          });
        });

        await Promise.all([cartInsertion, ...cartItemsInsertion]);
      },
    };

    await executeTransaction(transaction);

    return cart;
  }
}

export const defaultCartRepository = new CartRepositoryImpl();
